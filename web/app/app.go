package app

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"cloud.google.com/go/datastore"
	"github.com/ChimeraCoder/anaconda"
)

// App type
type App struct {
	dsClient *datastore.Client
	twClient *anaconda.TwitterApi
}

// NewApp function
func NewApp() (*App, error) {
	dsClient, err := datastore.NewClient(context.Background(), os.Getenv("GOOGLE_CLOUD_PROJECT"))
	if err != nil {
		return nil, err
	}
	anaconda.SetConsumerKey(os.Getenv("TWITTER_CONSUMER_KEY"))
	anaconda.SetConsumerSecret(os.Getenv("TWITTER_CONSUMER_SECRET"))
	twClient := anaconda.NewTwitterApi(
		os.Getenv("TWITTER_ACCESS_TOKEN"),
		os.Getenv("TWITTER_ACCESS_TOKEN_SECRET"),
	)
	return &App{
		dsClient,
		twClient,
	}, nil
}

// Handler method
func (app *App) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(app.indexHandler))
	mux.Handle("/api/", http.StripPrefix("/api", app.apiHandler()))
	mux.Handle("/admin/", http.StripPrefix("/admin", app.adminHandler()))
	mux.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))
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
	if os.Getenv("DEBUG") != "" {
		data["js"] = "http://localhost:8080"
	} else {
		data["js"] = "/static/js"
	}
	w.Header().Set("Content-Type", "text/html")
	if err := t.Execute(w, data); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
