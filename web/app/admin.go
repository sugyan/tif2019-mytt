package app

import (
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
	if err := app.storeTimeTable(timetable); err != nil {
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

func (app *App) storeTimeTable(timetable *timetable) error {
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
