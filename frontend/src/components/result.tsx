import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "../redux/store";
import { withRouter, RouteComponentProps } from "react-router";

interface StateProps {
    selected: Set<string>;
}

interface States {
    image: string;
}

type Props = StateProps & RouteComponentProps<{}>;

class Result extends React.Component<Props, States> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            image: "",
        };
    }
    public componentDidMount(): void {
        const { selected, history } = this.props;
        if (selected.size == 0) {
            history.push("/");
            return;
        }
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
            console.error(err.message);
        });
    }
    public render(): JSX.Element {
        const { image } = this.state;
        const result = image
            ? <img src={image} style={{ maxWidth: "100%" }} />
            : "画像を生成しています...";
        return (
          <div>{result}</div>
        );
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            selected: state.timetable.selected,
        };
    },
)(withRouter(Result));
