package main

import (
	"log"
	"net/http"
	"os"

	"github.com/sugyan/tif2019-mytt/web/app"
)

func main() {
	app, err := app.NewApp()
	if err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "18080"
	}
	if err := http.ListenAndServe(":"+port, app.Handler()); err != nil {
		log.Fatal(err)
	}
}
