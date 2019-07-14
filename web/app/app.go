package app

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

// App type
type App struct {
}

// NewApp function
func NewApp() *App {
	return &App{}
}

// Handler method
func (app *App) Handler() http.Handler {
	mux := http.DefaultServeMux
	mux.Handle("/", http.HandlerFunc(app.indexHandler))
	return mux
}

func (app *App) indexHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(filepath.Join("templates", "index.html"))
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if err := t.Execute(w, nil); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
