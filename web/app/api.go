package app

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
)

func (app *App) apiHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/timetable", http.HandlerFunc(app.timetableHandler))
	mux.Handle("/generate", http.HandlerFunc(app.generateHandler))
	return mux
}

func (app *App) timetableHandler(w http.ResponseWriter, r *http.Request) {
	var entity entityTimeTable
	if err := app.dsClient.Get(context.Background(), keyTimeTable, &entity); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(entity.Stages); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (app *App) generateHandler(w http.ResponseWriter, r *http.Request) {
	var ids []string
	if err := json.NewDecoder(r.Body).Decode(&ids); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	idsMap := map[string]bool{}
	for _, id := range ids {
		idsMap[id] = true
	}

	var entity entityTimeTable
	if err := app.dsClient.Get(context.Background(), keyTimeTable, &entity); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	stages := []*entry{}
	for _, stage := range entity.Stages {
		if idsMap[stage.ID] {
			stages = append(stages, stage)
		}
	}
	result, err := app.generateImage(stages)
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.Write([]byte(`data:image/png;base64,`))
	if _, err := base64.NewEncoder(base64.StdEncoding, w).Write(result); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
