import { combineReducers, Reducer } from "redux";

import { UpdateTimeTableAction, UPDATE_TIMETABLE, ToggleCheckboxAction, TOGGLE_CHECKBOX } from "./actions";
import { Item } from "../common/item";

export interface TimeTableState {
    items:  Item[];
}

export interface Stages {
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
    stages: Stages;
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
    stages: (state: Stages = {
        hotstage:      true,
        dollfactory:   true,
        skystage:      true,
        smilegarden:   true,
        festivalstage: true,
        dreamstage:    true,
        infocentre:    true,
        fujiyokostage: true,
    }, action: ToggleCheckboxAction): Stages => {
        switch (action.type) {
        case TOGGLE_CHECKBOX:
            return {
                ...state,
                [action.key]: !state[action.key as keyof Stages],
            };
        default:
            return state;
        }
    },
});

export default combineReducers({
    timetable,
    filter,
});
