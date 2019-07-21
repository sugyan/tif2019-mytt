import { Action } from "redux";

import { Item } from "../common/item";

export enum ActionTypes {
    UPDATE_TIMETABLE       = "UPDATE_TIMETABLE",
    SELECT_TIMETABLE_ITEMS = "SELECT_TIMETABLE_ITEMS",
    UPDATE_GENERATED_IMAGE = "UPDATE_GENERATED_IMAGE",
    TOGGLE_FILTER_DAYS     = "TOGGLE_FILTER_DAYS",
    TOGGLE_FILTER_STAGES   = "TOGGLE_FILTER_STAGES",
    CHANGE_FILTER_KEYWORD  = "CHANGE_FILTER_KEYWORD",
}

export interface SelectTimetable {
    id: string;
    selected: boolean;
}

interface UpdateTimetableAction extends Action {
    type: ActionTypes.UPDATE_TIMETABLE;
    items: Item[];
}

interface SelectTimetableItemsAction extends Action {
    type: ActionTypes.SELECT_TIMETABLE_ITEMS;
    selects: SelectTimetable[];
}

interface UpdateGeneratedImageAction extends Action {
    type: ActionTypes.UPDATE_GENERATED_IMAGE;
    image?: string;
}

export type TimetableAction = (
    | UpdateTimetableAction
    | SelectTimetableItemsAction
    | UpdateGeneratedImageAction
);

interface ToggleFilterDaysAction extends Action {
    type: ActionTypes.TOGGLE_FILTER_DAYS;
    key: string;
}

interface ToggleFilterStagesAction extends Action {
    type: ActionTypes.TOGGLE_FILTER_STAGES;
    key: string;
}

interface ChangeFilterKeywordAction extends Action {
    type: ActionTypes.CHANGE_FILTER_KEYWORD;
    word: string;
}

export type FilterAction = (
    | ToggleFilterDaysAction
    | ToggleFilterStagesAction
    | ChangeFilterKeywordAction
);

export const updateTimetable = (items: Item[]): UpdateTimetableAction => {
    return {
        type: ActionTypes.UPDATE_TIMETABLE,
        items,
    };
};

export const selectTimetableItems = (selects: SelectTimetable[]): SelectTimetableItemsAction => {
    return {
        type: ActionTypes.SELECT_TIMETABLE_ITEMS,
        selects,
    };
};

export const updateGeneratedImage = (image?: string): UpdateGeneratedImageAction => {
    return {
        type: ActionTypes.UPDATE_GENERATED_IMAGE,
        image,
    };
};

export const toggleFilterDays = (key: string): ToggleFilterDaysAction => {
    return {
        type: ActionTypes.TOGGLE_FILTER_DAYS,
        key,
    };
};

export const toggleFilterStages = (key: string): ToggleFilterStagesAction => {
    return {
        type: ActionTypes.TOGGLE_FILTER_STAGES,
        key,
    };
};

export const changeFilterKeyword = (word: string): ChangeFilterKeywordAction => {
    return {
        type: ActionTypes.CHANGE_FILTER_KEYWORD,
        word,
    };
};
