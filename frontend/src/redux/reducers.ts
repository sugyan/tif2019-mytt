import { combineReducers, Reducer } from "redux";

import {
    UPDATE_TIMETABLE, TOGGLE_FILTER_DAYS, TOGGLE_FILTER_STAGES, CHANGE_FILTER_KEYWORD,
    UpdateTimeTableAction, ToggleFilterDaysAction, ToggleFilterStagesAction, ChangeFilterKeywordAction,
} from "./actions";
import { Item } from "../common/item";

export interface TimeTableState {
    items:  Item[];
}

export interface FilterDays {
    day1: boolean;
    day2: boolean;
    day3: boolean;
}

export interface FilterStages {
    hotstage:      boolean;
    dollfactory:   boolean;
    skystage:      boolean;
    smilegarden:   boolean;
    festivalstage: boolean;
    dreamstage:    boolean;
    infocentre:    boolean;
    fujiyokostage: boolean;
}

export interface FilterState {
    days: FilterDays;
    stages: FilterStages;
    keyword: string;
}

const timetable: Reducer<TimeTableState> = combineReducers({
    items: (state = [], action: UpdateTimeTableAction): Item[] => {
        switch (action.type) {
        case UPDATE_TIMETABLE:
            return action.items;
        default:
            return state;
        }
    },
});

const filter: Reducer<FilterState> = combineReducers({
    days: (state: FilterDays = {
        day1: true,
        day2: true,
        day3: true,
    }, action: ToggleFilterDaysAction): FilterDays => {
        switch (action.type) {
        case TOGGLE_FILTER_DAYS:
            return {
                ...state,
                [action.key]: !state[action.key as keyof FilterDays],
            };
        default:
            return state;
        }
    },
    stages: (state: FilterStages = {
        hotstage:      true,
        dollfactory:   true,
        skystage:      true,
        smilegarden:   true,
        festivalstage: true,
        dreamstage:    true,
        infocentre:    true,
        fujiyokostage: true,
    }, action: ToggleFilterStagesAction): FilterStages => {
        switch (action.type) {
        case TOGGLE_FILTER_STAGES:
            return {
                ...state,
                [action.key]: !state[action.key as keyof FilterStages],
            };
        default:
            return state;
        }
    },
    keyword: (state: string = "", action: ChangeFilterKeywordAction): string => {
        switch (action.type) {
        case CHANGE_FILTER_KEYWORD:
            return action.word;
        default:
            return state;
        }
    },
});

export default combineReducers({
    timetable,
    filter,
});
