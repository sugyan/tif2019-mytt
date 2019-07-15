import * as React from "react";

import TimeTable from "./components/timetable";

class App extends React.Component {
    public componentDidMount(): void {
        fetch(
            "/api/timetable",
        ).then((response: Response): Promise<JSON> => {
            return response.json();
        }).then((data: JSON): void => {
            console.log(data);
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
export default App;
