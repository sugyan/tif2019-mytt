import { format } from "date-fns";
import ja from "date-fns/locale/ja";
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
        const rows: JSX.Element[] = items.map((item: Item): JSX.Element => {
            let content = item.artist;
            if (item.details) {
                content += ` [${item.details.join(", ")}]`;
            }
            return (
              <tr key={item.id}>
                <td>
                  <label>
                    {format(item.start, "M/D(dd) HH:mm", { locale: ja })} - {format(item.end, "HH:mm")}
                  </label>
                </td>
                <td>
                  <small>{item.stage}</small>
                  <br />
                  <strong>{content}</strong>
                </td>
              </tr>
            );
        });
        return (
          <table className="table">
            <tbody>
              {rows}
            </tbody>
          </table>
        );
    }
}
export default connect(
    (state: AppState): StateProps => state.timetable,
)(TimeTable);
