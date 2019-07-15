package app

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
)

func (app *App) apiHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/timetable", http.HandlerFunc(app.timetableHandler))
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
