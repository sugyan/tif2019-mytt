package main

import (
	"log"
	"net/http"
	"os"

	"github.com/sugyan/tif2019-mytt/web/app"
)

func main() {
	app := app.NewApp()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := http.ListenAndServe(":"+port, app.Handler()); err != nil {
		log.Fatal(err)
	}
}
