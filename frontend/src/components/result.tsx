import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import { AppState } from "../redux/store";
import { SelectTimetable, TimetableAction, selectTimetableItems } from "../redux/actions";

interface StateProps {
    selected: Set<string>;
}

interface DispatchProps {
    selectItems: (selects: SelectTimetable[]) => void;
}

type Props = DispatchProps & StateProps & RouteComponentProps<{ key?: string }>;

interface States {
    image?: string;
    message: string;
}

class Result extends React.Component<Props, States> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            message: "",
        };
    }
    public componentDidMount(): void {
        const { selected, selectItems, history, match } = this.props;
        if (selected.size == 0 && !match.params.key) {
            history.push("/");
            return;
        }
        if (match.params.key) {
            fetch(
                "/api/tt/" + match.params.key,
            ).then((response: Response): Promise<{ ids: string[] }> => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            }).then((results: { ids: string[] }): void => {
                selectItems(results.ids.map((id: string): SelectTimetable => {
                    return { id, selected: true };
                }));
                this.startGenerateImage();
            }).catch((err: Error): void => {
                console.error(err.message);
            });
        } else {
            this.startGenerateImage();
        }
    }
    public render(): JSX.Element {
        const { image, message } = this.state;
        const result = image
            ? <img src={image} style={{ maxWidth: "100%" }} />
            : <p className="mt-2">{message}</p>;
        return (
          <React.Fragment>
            {result}
            <nav className="navbar navbar-light bg-light fixed-bottom">
              <div className="float-left">
                <Link to="/" className="btn btn-outline-dark">選び直す</Link>
              </div>
              <div className="float-right">
                <button
                    className="btn btn-info"
                    disabled={!image}
                    onClick={this.onClickShareButton.bind(this)}>
                  共有用URLを生成
                </button>
              </div>
            </nav>
          </React.Fragment>
        );
    }
    private startGenerateImage(): void {
        const { selected } = this.props;
        const interval: number = window.setInterval((): void => {
            const { message } = this.state;
            this.setState({ message: (message || "画像を生成しています...") + "." });
        }, 500);
        fetch(
            "/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Array.from(selected)),
            }
        ).then((response: Response): Promise<string> => {
            return response.text();
        }).then((image: string): void => {
            this.setState({ image });
        }).catch((err: Error): void => {
            this.setState({ message: err.message });
        }).finally((): void => {
            window.clearInterval(interval);
            this.setState({ message: "" });
        });
    }
    private onClickShareButton(): void {
        const { selected, history } = this.props;
        fetch(
            "/api/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Array.from(selected).sort()),
            },
        ).then((response: Response): Promise<{ key: string }> => {
            return response.json();
        }).then((data: { key: string }): void => {
            history.push(`/tt/${data.key}`);
        }).catch((err: Error): void => {
            console.error(err.message);
        });
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            selected: state.timetable.selected,
        };
    },
    (dispatch: Dispatch<TimetableAction>): DispatchProps => {
        return {
            selectItems: (selects: SelectTimetable[]): void => {
                dispatch(selectTimetableItems(selects));
            },
        };
    }
)(withRouter(Result));
