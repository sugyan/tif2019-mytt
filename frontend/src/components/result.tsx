import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "../redux/store";

interface StateProps {
    selected: Set<string>;
}

class Result extends React.Component<StateProps> {
    public componentDidMount(): void {
        const { selected } = this.props;
        console.log(Array.from(selected).sort());
    }
    public render(): JSX.Element {
        return (
          <div>result</div>
        );
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            selected: state.timetable.selected,
        };
    },
)(Result);
