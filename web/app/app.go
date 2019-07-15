package app

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"cloud.google.com/go/datastore"
)

// App type
type App struct {
	projectID string
	dsClient  *datastore.Client
}

// NewApp function
func NewApp(projectID string) (*App, error) {
	dsClient, err := datastore.NewClient(context.Background(), projectID)
	if err != nil {
		return nil, err
	}
	return &App{
		projectID,
		dsClient,
	}, nil
}

// Handler method
func (app *App) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(app.indexHandler))
	mux.Handle("/api/", http.StripPrefix("/api", app.apiHandler()))
	mux.Handle("/admin/", http.StripPrefix("/admin", app.adminHandler()))
	return mux
}

func (app *App) indexHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(filepath.Join("templates", "index.html"))
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	data := map[string]interface{}{}
	if os.Getenv("GAE_APPLICATION") != "" {
		data["js"] = "/static/js"
	} else {
		data["js"] = "http://localhost:8080"
	}
	w.Header().Set("Content-Type", "text/html")
	if err := t.Execute(w, data); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
