import { combineReducers, Reducer } from "redux";

import { Item } from "../common/item";
import { UpdateTimeTableAction, UPDATE_TIMETABLE } from "./actions";

const timetable: Reducer = combineReducers({
    items: (state = [], action: UpdateTimeTableAction): Item[] => {
        switch (action.type) {
        case UPDATE_TIMETABLE:
            return action.items;
        default:
            return state;
        }
    },
});

export default combineReducers({
    timetable,
});
