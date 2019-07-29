import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { FilterAction, toggleFilterDays, toggleFilterStages, changeFilterKeyword } from "../redux/actions";
import { FilterState, FilterDays, FilterStages } from "../redux/reducers";
import { AppState } from "../redux/store";

interface CheckForm {
    key: string;
    label: string;
}

interface StateProps {
    filter: FilterState;
}

interface DispatchProps {
    toggleDays: (key: string) => void;
    toggleStages: (key: string) => void;
    changeKeyword: (word: string) => void;
}

interface State {
    keyword: string;
}

type Props = StateProps & DispatchProps

class Filter extends React.Component<Props, State> {
    private days: CheckForm[];
    private stages: CheckForm[];
    public constructor(props: Props) {
        super(props);
        this.days = [
            { key: "day1", label: "8/2(金)" },
            { key: "day2", label: "8/3(土)" },
            { key: "day3", label: "8/4(日)" },
        ];
        this.stages = [
            { key: "hotstage",      label: "HOT STAGE"       },
            { key: "smilegarden",   label: "SMILE GARDEN"    },
            { key: "dreamstage",    label: "DREAM STAGE"     },
            { key: "dollfactory",   label: "DOLL FACTORY"    },
            { key: "skystage",      label: "SKY STAGE"       },
            { key: "festivalstage", label: "FESTIVAL STAGE"  },
            { key: "fujiyokostage", label: "FUJI YOKO STAGE" },
            { key: "infocentre",    label: "INFO CENTRE"     },
            { key: "greetingarea",  label: "GREETING AREA"   },
        ];
        this.state = { keyword: props.filter.keyword };
    }
    public render(): JSX.Element {
        const { filter, toggleDays, toggleStages } = this.props;
        const { keyword } = this.state;
        const days = this.days.map((check: CheckForm): JSX.Element => {
            return (
              <div key={check.key} className="form-check form-check-inline">
                <input
                    id={check.key}
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.days[check.key as keyof FilterDays]}
                    onChange={(): void => toggleDays(check.key)} />
                <label className="form-check-label" htmlFor={check.key}>{check.label}</label>
              </div>
            );
        });
        const stages = this.stages.map((check: CheckForm): JSX.Element => {
            return (
              <div key={check.key} className="form-check form-check-inline">
                <input
                    id={check.key}
                    type="checkbox"
                    className="form-check-input"
                    checked={filter.stages[check.key as keyof FilterStages]}
                    onChange={(): void => toggleStages(check.key)} />
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
                  <div className="col-sm-10">{days}</div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 control-label">ステージ</label>
                  <div className="col-sm-10">{stages}</div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 control-label">出演者名</label>
                  <div className="col-sm-10">
                    <input
                        className="form-control"
                        type="text"
                        value={keyword}
                        onChange={this.onChangeKeyword.bind(this)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
    }
    private onChangeKeyword(event: React.FormEvent<HTMLInputElement>): void {
        const { changeKeyword } = this.props;
        const word = (event.target as HTMLInputElement).value;
        this.setState({ keyword: word }, (): void => {
            window.setTimeout((): void => {
                const { keyword } = this.state;
                if (keyword == word) {
                    changeKeyword(keyword);
                }
            }, 100);
        });
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            filter: state.filter,
        };
    },
    (dispatch: Dispatch<FilterAction>): DispatchProps => {
        return {
            toggleDays: (key: string): void => {
                dispatch(toggleFilterDays(key));
            },
            toggleStages: (key: string): void => {
                dispatch(toggleFilterStages(key));
            },
            changeKeyword: (word: string): void => {
                dispatch(changeFilterKeyword(word));
            },
        };
    }
)(Filter);
