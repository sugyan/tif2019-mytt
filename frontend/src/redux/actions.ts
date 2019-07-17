import { Action } from "redux";

import { Item } from "../common/item";

export const UPDATE_TIMETABLE = "UPDATE_TIMETABLE";
export const TOGGLE_CHECKBOX  = "TOGGLE_CHECKBOX";

export interface UpdateTimeTableAction extends Action {
    items: Item[];
}

export interface ToggleCheckboxAction extends Action  {
    key: string;
}

export const updateTimeTable = (items: Item[]): UpdateTimeTableAction => {
    return {
        type: UPDATE_TIMETABLE,
        items,
    };
};

export const toggleCheckbox = (key: string): ToggleCheckboxAction => {
    return {
        type: TOGGLE_CHECKBOX,
        key,
    };
};
