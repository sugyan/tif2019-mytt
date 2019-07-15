import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import App from "./app";
import reducers from "./redux/reducers";

window.addEventListener("DOMContentLoaded", (): void => {
    const app: JSX.Element = (
      <Provider store={createStore(reducers)}>
        <App />
      </Provider>
    );
    ReactDOM.render(app, document.getElementById("app"));
});
