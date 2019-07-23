import { combineReducers, Reducer } from "redux";

import { Item } from "../common/item";
import { ActionTypes, SelectTimetable, TimetableAction, FilterAction } from "./actions";

export interface TimetableState {
    items:  Item[];
    selected: Set<string>;
    image?: string;
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

const timetable: Reducer<TimetableState, TimetableAction> = (state: TimetableState = {
    items: [],
    selected: new Set(),
}, action: TimetableAction): TimetableState => {
    switch (action.type) {
    case ActionTypes.UPDATE_TIMETABLE:
        return {
            ...state,
            items: action.items,
        };
    case ActionTypes.SELECT_TIMETABLE_ITEMS:
        action.selects.forEach((value: SelectTimetable): void => {
            if (value.selected) {
                state.selected.add(value.id);
            } else {
                state.selected.delete(value.id);
            }
        });
        return {
            ...state,
            selected: new Set(state.selected),
        };
    case ActionTypes.UPDATE_GENERATED_IMAGE:
        return {
            ...state,
            image: action.image,
        };
    default:
        ((_: never): void => {})(action);
        return state;
    }
};

const filter: Reducer<FilterState, FilterAction> = (state: FilterState = {
    days: {
        day1: true,
        day2: true,
        day3: true,
    },
    stages: {
        hotstage:      true,
        dollfactory:   true,
        skystage:      true,
        smilegarden:   true,
        festivalstage: true,
        dreamstage:    true,
        infocentre:    true,
        fujiyokostage: true,
    },
    keyword: "",
}, action: FilterAction): FilterState => {
    switch (action.type) {
    case ActionTypes.TOGGLE_FILTER_DAYS:
        return {
            ...state,
            days: {
                ...state.days,
                [action.key]: !state.days[action.key as keyof FilterDays],
            },
        };
    case ActionTypes.TOGGLE_FILTER_STAGES:
        return {
            ...state,
            stages: {
                ...state.stages,
                [action.key]: !state.stages[action.key as keyof FilterStages],
            },
        };
    case ActionTypes.CHANGE_FILTER_KEYWORD:
        return {
            ...state,
            keyword: action.word,
        };
    default:
        ((_: never): void => {})(action);
        return state;
    }
};

export const reducers = combineReducers({
    timetable,
    filter,
});
