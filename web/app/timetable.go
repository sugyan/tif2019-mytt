package app

type timetable struct {
	Day1 *stages `json:"day1"`
	Day2 *stages `json:"day2"`
	Day3 *stages `json:"day3"`
}

type stages struct {
	HotStage      []*stageitem `json:"HOT STAGE"`
	DollFactory   []*stageitem `json:"DOLL FACTORY"`
	SkyStage      []*stageitem `json:"SKY STAGE"`
	SmileGarden   []*stageitem `json:"SMILE GARDEN"`
	FestivalStage []*stageitem `json:"FESTIVAL STAGE"`
	DreamStage    []*stageitem `json:"DREAM STAGE"`
	InfoCentre    []*stageitem `json:"INFO CENTRE"`
	FujiYokoStage []*stageitem `json:"FUJI YOKO STAGE"`
	GreetingArea  []*stageitem
}

type stageitem struct {
	Start  string `json:"start"`
	End    string `json:"end"`
	Artist string `json:"artist"`
	Detail string `json:"detail"`
}
