import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ToggleCheckboxAction, toggleCheckbox } from "../redux/actions";
import { FilterState, Stages } from "../redux/reducers";
import { AppState } from "../redux/store";

interface Check {
    key: string;
    label: string;
}

interface StateProps {
    filter: FilterState;
}

interface DispatchProps {
    toggleCheckbox: (key: string) => void;
}

type Props = StateProps & DispatchProps

class Filter extends React.Component<Props> {
    private days: Check[];
    private stages: Check[];

    public constructor(props: Props) {
        super(props);
        this.days = [];
        this.stages = [
            { key: "hotstage",      label: "HOT STAGE"       },
            { key: "dollfactory",   label: "DOLL FACTORY"    },
            { key: "skystage",      label: "SKY STAGE"       },
            { key: "smilegarden",   label: "SMILE GARDEN"    },
            { key: "festivalstage", label: "FESTIVAL STAGE"  },
            { key: "dreamstage",    label: "DREAM STAGE"     },
            { key: "infocentre",    label: "INFO CENTRE"     },
            { key: "fujiyokostage", label: "FUJI YOKO STAGE" },
        ];
    }
    public render(): JSX.Element {
        const { filter, toggleCheckbox } = this.props;
        const stages = this.stages.map((check: Check): JSX.Element => {
            return (
              <div key={check.key} className="form-check form-check-inline">
                <input
                    id={check.key}
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.stages[check.key as keyof Stages]}
                    onChange={(): void => toggleCheckbox(check.key)} />
                <label className="form-check-label" htmlFor={check.key}>{check.label}</label>
              </div>
            );
        });
        return (
          <div className="card my-2">
            <div className="card-body pt-2 pb-0">
              <form className="form-horizontal" onSubmit={(e): void => e.preventDefault()}>
                <div className="form-group row">
                  <label className="col-sm-2 control-label">日付</label>
                  {/* <div className="col-sm-10">{days}</div> */}
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 control-label">ステージ</label>
                  <div className="col-sm-10">{stages}</div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 control-label">出演者名</label>
                  <div className="col-sm-10">
                    {/* <input
                          className="form-control"
                          type="text"
                          value={keyword}
                          onChange={(e) => onChangeKeyword(e.target.value)}
                                /> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            filter: state.filter,
        };
    },
    (dispatch: Dispatch<ToggleCheckboxAction>): DispatchProps => {
        return {
            toggleCheckbox: (key: string): void => {
                dispatch(toggleCheckbox(key));
            },
        };
    }
)(Filter);
