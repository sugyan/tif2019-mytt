import { Action } from "redux";

import { Item } from "../common/item";

export const UPDATE_TIMETABLE = "UPDATE_TIMETABLE";

export interface UpdateTimeTableAction extends Action {
    items: Item[];
}

export const updateTimeTable = (items: Item[]): UpdateTimeTableAction => {
    return {
        type: UPDATE_TIMETABLE,
        items,
    };
};
