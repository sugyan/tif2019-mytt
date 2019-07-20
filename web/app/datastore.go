package app

import (
	"time"

	"cloud.google.com/go/datastore"
)

const (
	kindTimetable = "Timetable"
	kindResult    = "Result"
)

var keyTimeTable = datastore.IDKey(kindTimetable, 1, nil)

type entityTimetable struct {
	Stages []*entry
}

type entityResult struct {
	IDs       []string
	CreatedAt time.Time
}
