package app

import (
	"cloud.google.com/go/datastore"
)

const (
	kindTimeTable = "TimeTable"
)

var keyTimeTable = datastore.IDKey(kindTimeTable, 1, nil)

type entityTimeTable struct {
	Stages []*entry `datastore:"Stages"`
}
