import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Filter from "./filter";
import Timetable from "./timetable";
import { AppState } from "../redux/store";

interface StateProps {
    selected: Set<string>;
}

class Index extends React.Component<StateProps> {
    public render(): JSX.Element {
        const { selected } = this.props;
        const footer = ((): JSX.Element | null => {
            if (selected.size == 0) return null;
            return (
              <nav className="navbar navbar-light bg-light fixed-bottom">
                <div className="container-fluid text-center">
                  <div className="navbar-collapse">
                    <Link to="/result" className="btn btn-primary">
                      選択中の<strong>{selected.size}</strong>件でタイムテーブルを生成
                    </Link>
                  </div>
                </div>
              </nav>
            );
        })();
        return (
          <div style={{ paddingBottom: 54 }}>
            <Filter />
            <Timetable />
            {footer}
          </div>
        );
    }
}
export default connect(
    (state: AppState): StateProps => {
        return {
            selected: state.timetable.selected,
        };
    },
)(Index);
