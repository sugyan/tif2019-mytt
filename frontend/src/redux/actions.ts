import { Action } from "redux";

import { Item } from "../common/item";

export const UPDATE_TIMETABLE      = "UPDATE_TIMETABLE";
export const TOGGLE_FILTER_DAYS    = "TOGGLE_FILTER_DAYS";
export const TOGGLE_FILTER_STAGES  = "TOGGLE_FILTER_STAGES";
export const CHANGE_FILTER_KEYWORD = "CHANGE_FILTER_KEYWORD";

export interface UpdateTimeTableAction extends Action {
    items: Item[];
}

interface ToggleCheckboxAction extends Action  {
    key: string;
}

export type ToggleFilterDaysAction   = ToggleCheckboxAction;
export type ToggleFilterStagesAction = ToggleCheckboxAction;
export interface ChangeFilterKeywordAction extends Action {
    word: string;
}

export type FilterAction = ToggleFilterDaysAction | ToggleFilterStagesAction | ChangeFilterKeywordAction;

export const updateTimeTable = (items: Item[]): UpdateTimeTableAction => {
    return {
        type: UPDATE_TIMETABLE,
        items,
    };
};

export const toggleFilterDays = (key: string): ToggleFilterDaysAction => {
    return {
        type: TOGGLE_FILTER_DAYS,
        key,
    };
};

export const toggleFilterStages = (key: string): ToggleFilterStagesAction => {
    return {
        type: TOGGLE_FILTER_STAGES,
        key,
    };
};

export const changeFilterKeyword = (word: string): ChangeFilterKeywordAction => {
    return {
        type: CHANGE_FILTER_KEYWORD,
        word,
    };
};