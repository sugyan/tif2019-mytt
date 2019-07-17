import { Dayjs } from "dayjs";

export interface Item {
    id: string;
    start: Dayjs;
    end: Dayjs;
    dayCode: string;
    stageName: string;
    stageCode: string;
    artist: string;
    details: string[];
}
