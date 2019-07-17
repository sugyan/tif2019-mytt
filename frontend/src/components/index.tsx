import * as React from "react";

import Filter from "./filter";
import Timetable from "./timetable";

class Index extends React.Component {
    public render(): JSX.Element {
        return (
          <React.Fragment>
            <Filter />
            <Timetable />
          </React.Fragment>
        );
    }
}
export default Index;
