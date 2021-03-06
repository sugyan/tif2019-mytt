package app

import (
	"context"
	"crypto/sha1"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"cloud.google.com/go/datastore"
)

type ttResponse struct {
	IDs      []string `json:"ids"`
	ImageURL string   `json:"image_url"`
}

func (app *App) apiHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/timetable", http.HandlerFunc(app.timetableHandler))
	mux.Handle("/generate", http.HandlerFunc(app.generateHandler))
	mux.Handle("/share", http.HandlerFunc(app.shareHandler))
	mux.Handle("/tt/", http.HandlerFunc(app.ttHandler))
	return mux
}

func (app *App) timetableHandler(w http.ResponseWriter, r *http.Request) {
	var entity entityTimetable
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
	result, err := app.generateImageFromIDS(ids)
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

func (app *App) shareHandler(w http.ResponseWriter, r *http.Request) {
	var ids []string
	if err := json.NewDecoder(r.Body).Decode(&ids); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	result, err := app.generateImageFromIDS(ids)
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// tweet the image
	media, err := app.twClient.UploadMedia(base64.RawStdEncoding.EncodeToString(result))
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	params := url.Values{}
	params.Add("media_ids", media.MediaIDString)
	tweet, err := app.twClient.PostTweet("", params)
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if len(tweet.Entities.Media) == 0 {
		log.Printf("No media")
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// generate key
	hash := sha1.New()
	hash.Write([]byte(strings.Join(ids, ",")))
	hashkey := hex.EncodeToString(hash.Sum(nil))[:8]
	key := datastore.NameKey(kindResult, hashkey, nil)
	data := &entityResult{
		IDs:       ids,
		ImageURL:  tweet.Entities.Media[0].Display_url,
		CreatedAt: time.Now(),
	}
	// store to Cloud Datastore
	key, err = app.dsClient.Put(context.Background(), key, data)
	if err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res := &struct {
		Key string `json:"key"`
	}{
		Key: key.Name,
	}
	if err := json.NewEncoder(w).Encode(res); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (app *App) ttHandler(w http.ResponseWriter, r *http.Request) {
	var entity entityResult
	key := datastore.NameKey(kindResult, strings.TrimPrefix(r.URL.Path, "/tt/"), nil)
	if err := app.dsClient.Get(context.Background(), key, &entity); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}
	res := &ttResponse{
		IDs:      entity.IDs,
		ImageURL: entity.ImageURL,
	}
	if err := json.NewEncoder(w).Encode(res); err != nil {
		log.Printf(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (app *App) generateImageFromIDS(ids []string) ([]byte, error) {
	idsMap := map[string]bool{}
	for _, id := range ids {
		idsMap[id] = true
	}

	var entity entityTimetable
	if err := app.dsClient.Get(context.Background(), keyTimeTable, &entity); err != nil {
		return nil, err
	}
	stages := []*entry{}
	for _, stage := range entity.Stages {
		if idsMap[stage.ID] {
			stages = append(stages, stage)
		}
	}
	return app.generateImage(stages)
}
