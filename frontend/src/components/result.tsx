import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import { AppState } from "../redux/store";
import { SelectTimetable, TimetableAction, selectTimetableItems, updateGeneratedImage } from "../redux/actions";

interface TTResponse {
    ids: string[];
    image_url: string;
}

interface StateProps {
    selected: Set<string>;
    image?: string;
}

interface DispatchProps {
    selectItems: (selects: SelectTimetable[]) => void;
    updateImage: (image?: string) => void;
}

type Props = DispatchProps & StateProps & RouteComponentProps<{ key?: string }>;

interface States {
    message: string;
    fetching: boolean;
    imageUrl?: string;
}

class Result extends React.Component<Props, States> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            message: "画像を生成しています...",
            fetching: false,
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
            ).then((response: Response): Promise<TTResponse> => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            }).then((result: TTResponse): void => {
                const { image } = this.props;
                this.setState({ imageUrl: result.image_url });
                selectItems(result.ids.map((id: string): SelectTimetable => {
                    return { id, selected: true };
                }));
                if (!image) {
                    this.startGenerateImage();
                }
            }).catch((err: Error): void => {
                console.error(err.message);
            });
        } else {
            this.startGenerateImage();
        }
    }
    public render(): JSX.Element {
        const { image, match } = this.props;
        const { message, fetching, imageUrl } = this.state;
        const result: JSX.Element = image
            ? <img src={image} style={{ maxWidth: "100%" }} />
            : <p className="mt-2">{message}</p>;
        const button: JSX.Element = match.params.key
            ? (
              <a
                  className="btn btn-primary"
                  href={
                      "https://twitter.com/intent/tweet?hashtags=TIF2019_MyTT"
                      + "&text=" + encodeURIComponent(`今年のタイテ ${imageUrl}`)
                      + "&url=" + encodeURIComponent(window.location.href)}
                  target="_blank"
                  rel="noopener noreferrer">
                Tweetする
              </a>
            )
            : (
              <button
                  className="btn btn-info"
                  disabled={!image || fetching}
                  onClick={this.onClickShareButton.bind(this)}>
                    共有用URLを生成
              </button>
            );
        return (
          <React.Fragment>
            {result}
            <nav className="navbar navbar-light bg-light fixed-bottom">
              <div className="float-left">
                <Link to="/" className="btn btn-outline-dark">選び直す</Link>
              </div>
              <div className="float-right">
                {button}
              </div>
            </nav>
          </React.Fragment>
        );
    }
    private startGenerateImage(): void {
        const { selected, updateImage } = this.props;
        updateImage();
        const interval: number = window.setInterval((): void => {
            const { message } = this.state;
            this.setState({ message: message + "." });
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
            updateImage(image);
        }).catch((err: Error): void => {
            this.setState({ message: err.message });
        }).finally((): void => {
            window.clearInterval(interval);
            this.setState({ message: "" });
        });
    }
    private onClickShareButton(): void {
        const { selected, history } = this.props;
        this.setState({ fetching: true });
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
        }).then((result: { key: string }): void => {
            history.push(`/tt/${result.key}`);
        }).catch((err: Error): void => {
            console.error(err.message);
            this.setState({ fetching: false });
        });
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            selected: state.timetable.selected,
            image: state.timetable.image,
        };
    },
    (dispatch: Dispatch<TimetableAction>): DispatchProps => {
        return {
            selectItems: (selects: SelectTimetable[]): void => {
                dispatch(selectTimetableItems(selects));
            },
            updateImage: (image?: string): void => {
                dispatch(updateGeneratedImage(image));
            },
        };
    }
)(withRouter(Result));
