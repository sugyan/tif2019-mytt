package app

import (
	"bytes"
	"fmt"
	"os/exec"
	"sort"
	"strings"
)

const (
	width     = 545
	height    = 35
	pointsize = 15
)

var colorMap = map[string]string{
	"hotstage":      "#FA3D56",
	"dollfactory":   "#FF88B4",
	"skystage":      "#39CDFE",
	"smilegarden":   "#B1DD00",
	"festivalstage": "#FFDF33",
	"dreamstage":    "#00C858",
	"infocentre":    "#FB3CA6",
	"fujiyokostage": "#06708F",
}

func (app *App) generateImage(stages []*entry) ([]byte, error) {
	items := map[string][]*entry{}
	for _, stage := range stages {
		date := stage.Start.Format("2006-01-02")
		if entries, exist := items[date]; exist {
			items[date] = append(entries, stage)
		} else {
			items[date] = []*entry{stage}
		}
	}
	keys := []string{}
	for key := range items {
		keys = append(keys, key)
		sort.SliceStable(items[key], func(i, j int) bool {
			return items[key][i].Start.Unix() < items[key][j].Start.Unix()
		})
	}
	sort.SliceStable(keys, func(i, j int) bool { return keys[i] < keys[j] })

	// compose command pipelines
	commands := []*exec.Cmd{}
	convert, err := exec.LookPath("convert")
	if err != nil {
		return nil, err
	}
	for _, key := range keys {
		commands = append(commands, exec.Command(
			convert,
			"-size", fmt.Sprintf("%dx%d", width, height), "xc:white",
			"-font", ".fonts/ipagp.ttf",
			"-pointsize", fmt.Sprintf("%d", pointsize),
			"-gravity", "Center",
			"-annotate", "+0+0", key,
			"miff:-",
		))
		for _, stage := range items[key] {
			color := colorMap[stage.StageCode]
			artist := stage.Artist
			if len(stage.Details) > 0 {
				artist += fmt.Sprintf(" [%s]", strings.Join(stage.Details, ", "))
			}
			cmd := exec.Command(
				convert,
				"-size", fmt.Sprintf("%dx%d", width, height), fmt.Sprintf("xc:%s", color),
				"-fill", "white",
				"-draw", fmt.Sprintf("roundrectangle 4,4 %d,%d, 5,5", width-5, height-5),
				"-fill", "black",
				"-pointsize", fmt.Sprintf("%d", pointsize),
				"-annotate", "+10+24", fmt.Sprintf("%s - %s", stage.Start.Format("15:04"), stage.End.Format("15:04")),
				"-annotate", "+100+24", fmt.Sprintf("[%s]", stage.StageName),
				"-font", ".fonts/ipagp.ttf",
				"-annotate", "+265+24", artist,
				"miff:-",
			)
			commands = append(commands, cmd)
		}
	}

	// execute commands
	buf := bytes.NewBuffer(nil)
	for _, command := range commands {
		out, err := command.Output()
		if err != nil {
			return nil, err
		}
		if _, err := buf.Write(out); err != nil {
			return nil, err
		}
	}
	cmd := exec.Command(convert, "-", "-append", "png:-")
	cmd.Stdin = buf
	return cmd.Output()
}
