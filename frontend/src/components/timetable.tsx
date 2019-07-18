import "dayjs/locale/ja";
import * as React from "react";
import { connect } from "react-redux";

import { Item } from "../common/item";
import { escapeRegExp } from "../common/utils";
import { TimeTableState, FilterState, FilterDays, FilterStages } from "../redux/reducers";
import { AppState } from "../redux/store";

interface StateProps {
    timetable: TimeTableState;
    filter: FilterState;
}

class TimeTable extends React.Component<StateProps> {
    public render(): JSX.Element {
        const { timetable, filter } = this.props;
        const regexp = filter.keyword ? new RegExp(escapeRegExp(filter.keyword), "i") : null;
        const rows: JSX.Element[] = timetable.items.filter((item: Item): boolean => {
            if (!filter.days[item.dayCode as keyof FilterDays]) {
                return false;
            }
            if (!filter.stages[item.stageCode as keyof FilterStages]) {
                return false;
            }
            if (regexp) {
                if (item.details && regexp.test(item.details.join(" "))) {
                    return true;
                }
                return regexp.test(item.artist);
            }
            return true;
        }).map((item: Item): JSX.Element => {
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
                      {item.start.locale("ja").format("M/D(dd) HH:mm")} - {item.end.format("HH:mm")}
                    </label>
                  </div>
                </td>
                <td className={`column-stage ${item.stageCode}`} style={{ padding: 4 }}>
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
          <React.Fragment>
            <p>全{rows.length}件</p>
            <table className="table">
              <tbody>
                {rows}
              </tbody>
            </table>
          </React.Fragment>
        );
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            timetable: state.timetable,
            filter: state.filter,
        };
    },
)(TimeTable);
