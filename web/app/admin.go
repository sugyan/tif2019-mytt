package app

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"sort"
	"strings"
	"time"
)

type entry struct {
	ID        string    `json:"id"`
	DayCode   string    `json:"day_code"`
	StageName string    `json:"stage_name"`
	StageCode string    `json:"stage_code"`
	Start     time.Time `json:"start"`
	End       time.Time `json:"end"`
	Artist    string    `json:"artist"`
	Details   []string  `json:"details"`
}

func (app *App) adminHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/update", http.HandlerFunc(app.updateHandler))
	return mux
}

func (app *App) updateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-Appengine-Cron") != "true" {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	timetable, err := fetchTimeTable()
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	greeting, err := fetchGreeting()
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if err := app.storeTimeTable(timetable, greeting); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	log.Printf("update done.")
}

func fetchTimeTable() (*timetable, error) {
	resp, err := http.Get("http://www.idolfes.com/2019/json/timetable/time.json")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var timetable timetable
	if err := json.NewDecoder(resp.Body).Decode(&timetable); err != nil {
		return nil, err
	}
	return &timetable, nil
}

func fetchGreeting() (*timetable, error) {
	resp, err := http.Get("http://www.idolfes.com/2019/greeting/greeting.tsv")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	timetable := &timetable{
		Day1: &stages{GreetingArea: []*stageitem{}},
		Day2: &stages{GreetingArea: []*stageitem{}},
		Day3: &stages{GreetingArea: []*stageitem{}},
	}
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		row := strings.Split(scanner.Text(), "\t")
		times := strings.SplitN(row[1], "～", 2)
		for i := 2; i < len(row); i++ {
			if row[i] == "" {
				continue
			}
			item := &stageitem{
				Start:  times[0],
				End:    times[1],
				Artist: row[i],
				Detail: string('A' + i - 2),
			}
			switch row[0] {
			case "day1":
				timetable.Day1.GreetingArea = append(timetable.Day1.GreetingArea, item)
			case "day2":
				timetable.Day2.GreetingArea = append(timetable.Day2.GreetingArea, item)
			case "day3":
				timetable.Day3.GreetingArea = append(timetable.Day3.GreetingArea, item)
			}
		}
	}
	return timetable, nil
}

func (app *App) storeTimeTable(timetable, greeting *timetable) error {
	entries := []*entry{}
	ids := map[string]struct{}{}
	for i, s := range []*stages{timetable.Day1, timetable.Day2, timetable.Day3} {
		dayCode := []string{"day1", "day2", "day3"}[i]
		for j, items := range [][]*stageitem{s.HotStage, s.DollFactory, s.SkyStage, s.SmileGarden, s.FestivalStage, s.DreamStage, s.InfoCentre, s.FujiYokoStage} {
			stageName := []string{"HOT STAGE", "DOLL FACTORY", "SKY STAGE", "SMILE GARDEN", "FESTIVAL STAGE", "DREAM STAGE", "INFO CENTRE", "FUJI YOKO STAGE"}[j]
			stageCode := strings.ToLower(strings.ReplaceAll(stageName, " ", ""))
			for _, item := range items {
				// skip specified items...
				if item.Artist == "メンテナンス" {
					continue
				}

				id := fmt.Sprintf("%s-%s-%s", dayCode, stageCode, item.Start)
				if _, exist := ids[id]; exist {
					continue
				}
				ids[id] = struct{}{}

				start, _ := time.Parse("2006-01-02 1504 -0700", fmt.Sprintf("2019-08-%02d %s +0900", i+2, item.Start))
				end, _ := time.Parse("2006-01-02 1504 -0700", fmt.Sprintf("2019-08-%02d %s +0900", i+2, item.End))
				artist := strings.Trim(item.Artist, " ")
				details := []string{}
				if item.Detail != "null" {
					d := item.Detail
					d = regexp.MustCompile("■.*?■").ReplaceAllString(d, "")
					d = regexp.MustCompile("<br>").ReplaceAllString(d, "")
					if d != "" {
						details = strings.Split(d, "／")
					}
				}
				entries = append(entries, &entry{
					ID:        id,
					DayCode:   dayCode,
					StageName: stageName,
					StageCode: stageCode,
					Start:     start,
					End:       end,
					Artist:    artist,
					Details:   details,
				})
			}
		}
	}
	for i, s := range []*stages{greeting.Day1, greeting.Day2, greeting.Day3} {
		dayCode := []string{"day1", "day2", "day3"}[i]
		items := s.GreetingArea
		stageCode := "greetingarea"
		for _, item := range items {
			id := fmt.Sprintf("%s-%s-%s-%s", dayCode, stageCode, strings.Replace(item.Start, "：", "", -1), item.Detail)
			start, _ := time.Parse("2006-01-02 15：04 -0700", fmt.Sprintf("2019-08-%02d %s +0900", i+2, item.Start))
			end, _ := time.Parse("2006-01-02 15：04 -0700", fmt.Sprintf("2019-08-%02d %s +0900", i+2, item.End))
			artist := strings.Trim(item.Artist, " ")
			details := []string{}
			entries = append(entries, &entry{
				ID:        id,
				DayCode:   dayCode,
				StageName: fmt.Sprintf("GREETING AREA (%s)", item.Detail),
				StageCode: stageCode,
				Start:     start,
				End:       end,
				Artist:    artist,
				Details:   details,
			})
		}
	}
	sort.SliceStable(entries, func(i, j int) bool {
		return entries[i].Start.Unix() < entries[j].Start.Unix()
	})
	data := &entityTimetable{
		Stages: entries,
	}
	if _, err := app.dsClient.Put(context.Background(), keyTimeTable, data); err != nil {
		return err
	}
	return nil
}
