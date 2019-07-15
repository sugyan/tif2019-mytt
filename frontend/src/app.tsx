import { parse } from "date-fns";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Item } from "./common/item";
import TimeTable from "./components/timetable";
import { updateTimeTable, UpdateTimeTableAction } from "./redux/actions";
import { AppState } from "./redux/store";

interface Result {
    id: string;
    stage: string;
    start: string;
    end: string;
    artist: string;
    details: string[];
}

interface DispatchProps {
    updateTimeTable(items: Item[]): void;
}

class App extends React.Component<DispatchProps> {
    public componentDidMount(): void {
        const { updateTimeTable } = this.props;
        fetch(
            "/api/timetable",
        ).then((response: Response): Promise<Result[]> => {
            return response.json();
        }).then((results: Result[]): void => {
            updateTimeTable(results.map((result: Result): Item => {
                return {
                    id: result.id,
                    start: parse(result.start),
                    end: parse(result.end),
                    stage: result.stage,
                    artist: result.artist,
                    details: result.details,
                };
            }));
        }).catch((err: Error): void => {
            console.error(err.message);
        });
    }
    public render(): JSX.Element {
        return (
          <React.Fragment>
            <TimeTable />
          </React.Fragment>
        );
    }
}
export default connect(
    (state: AppState): {} => state,
    (dispatch: Dispatch<UpdateTimeTableAction>): DispatchProps => {
        return {
            updateTimeTable: (items: Item[]): void => {
                dispatch(updateTimeTable(items));
            },
        };
    },
)(App);
