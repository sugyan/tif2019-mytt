import spacetime from "spacetime";
import * as React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Dispatch } from "redux";

import Index from "./components/index";
import Result from "./components/result";
import { Item } from "./common/item";
import { TimetableAction, updateTimetable } from "./redux/actions";
import { AppState } from "./redux/store";

interface ResponseItem {
    id: string;
    day_code: string;
    stage_name: string;
    stage_code: string;
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
        ).then((response: Response): Promise<ResponseItem[]> => {
            return response.json();
        }).then((results: ResponseItem[]): void => {
            updateTimeTable(results.map((result: ResponseItem): Item => {
                const start = spacetime(result.start);
                const end = spacetime(result.end);
                const day: string = "日月火水木金土"[start.day()];
                const date = `${start.unixFmt("M/d")}(${day})`;
                const time = `${date} ${start.unixFmt("HH:mm")} - ${end.unixFmt("HH:mm")}`;
                return {
                    id: result.id,
                    time,
                    dayCode: result.day_code,
                    stageName: result.stage_name,
                    stageCode: result.stage_code,
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
          <BrowserRouter>
            <div>
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                  <Link to="/" className="navbar-brand">TIF 2019 MyTT</Link>
                </div>
              </nav>
              <div className="container" style={{ paddingBottom: 54 }}>
                <Route path="/" exact component={Index} />
                <Route path="/result" component={Result} />
                <Route path="/tt/:key" component={Result} />
              </div>
            </div>
          </BrowserRouter>
        );
    }
}
export default connect(
    (state: AppState) => state,
    (dispatch: Dispatch<TimetableAction>): DispatchProps => {
        return {
            updateTimeTable: (items: Item[]): void => {
                dispatch(updateTimetable(items));
            },
        };
    },
)(App);
