import * as React from "react";
import { connect } from "react-redux";

import { Item } from "../common/item";
import { AppState } from "../redux/store";

interface StateProps {
    items: Item[];
}

class TimeTable extends React.Component<StateProps> {
    public render(): JSX.Element {
        const { items } = this.props;
        const results: JSX.Element[] = items.map((item: Item): JSX.Element => {
            return (
              <li key={item.id}>
                <div>{item.start.toString()} {item.stage} {item.artist}</div>
              </li>
            );
        });
        return (
          <ul>
            {results}
          </ul>
        );
    }
}
export default connect(
    (state: AppState): StateProps => state.timetable,
)(TimeTable);
