import { Action } from "redux";

import { Item } from "../common/item";

export const UPDATE_TIMETABLE       = "UPDATE_TIMETABLE";
export const SELECT_TIMETABLE_ITEMS = "SELECT_TIMETABLE_ITEMS";
export const TOGGLE_FILTER_DAYS     = "TOGGLE_FILTER_DAYS";
export const TOGGLE_FILTER_STAGES   = "TOGGLE_FILTER_STAGES";
export const CHANGE_FILTER_KEYWORD  = "CHANGE_FILTER_KEYWORD";

export interface SelectTimetable {
    id: string;
    selected: boolean;
}

export interface UpdateTimetableAction extends Action {
    items: Item[];
}

export interface SelectTimetableItemsAction extends Action {
    selects: SelectTimetable[];
}

export type TimetableAction = UpdateTimetableAction | SelectTimetableItemsAction;

interface ToggleCheckboxAction extends Action  {
    key: string;
}

export type ToggleFilterDaysAction   = ToggleCheckboxAction;
export type ToggleFilterStagesAction = ToggleCheckboxAction;
export interface ChangeFilterKeywordAction extends Action {
    word: string;
}

export type FilterAction = ToggleFilterDaysAction | ToggleFilterStagesAction | ChangeFilterKeywordAction;

export const updateTimetable = (items: Item[]): UpdateTimetableAction => {
    return {
        type: UPDATE_TIMETABLE,
        items,
    };
};

export const selectTimetableItems = (selects: SelectTimetable[]): SelectTimetableItemsAction => {
    return {
        type: SELECT_TIMETABLE_ITEMS,
        selects,
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