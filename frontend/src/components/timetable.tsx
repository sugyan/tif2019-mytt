import * as React from "react";
import { connect } from "react-redux";

import { Item } from "../common/item";
import { escapeRegExp } from "../common/utils";
import { TimetableAction, SelectTimetable, selectTimetableItems } from "../redux/actions";
import { TimetableState, FilterState, FilterDays, FilterStages } from "../redux/reducers";
import { AppState } from "../redux/store";
import { Dispatch } from "redux";

interface StateProps {
    timetable: TimetableState;
    filter: FilterState;
}

interface DispatchProps {
    selectItem: (select: SelectTimetable) => void;
}

type Props = StateProps & DispatchProps;

class Timetable extends React.Component<Props> {
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
                          className="form-check-input"
                          checked={timetable.selected.has(item.id)}
                          onChange={this.onChangeCheckbox.bind(this)} />
                      {item.time}
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
    private onChangeCheckbox(event: React.FormEvent<HTMLInputElement>): void {
        const { selectItem } = this.props;
        const target = event.target as HTMLInputElement;
        selectItem({
            id: target.id,
            selected: target.checked,
        });
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            timetable: state.timetable,
            filter: state.filter,
        };
    },
    (dispatch: Dispatch<TimetableAction>): DispatchProps => {
        return {
            selectItem: (select: SelectTimetable): void => {
                dispatch(selectTimetableItems([select]));
            },
        };
    }
)(Timetable);
