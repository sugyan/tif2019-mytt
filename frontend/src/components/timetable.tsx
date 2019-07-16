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
                <td className="column-datetime">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                          id={item.id}
                          type="checkbox"
                          className="form-check-input" />
                      {format(item.start, "M/D(dd) HH:mm", { locale: ja })} - {format(item.end, "HH:mm")}
                    </label>
                  </div>
                </td>
                <td className={`column-stage ${item.stageCode}`}>
                  <label htmlFor={item.id}>
                    <small>{item.stageName}</small>
                    <br />
                    <strong>{content}</strong>
                  </label>
                </td>
              </tr>
            );
        });
        return (
          <table className="table table-sm">
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
