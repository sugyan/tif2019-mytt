import * as ReactDOM from "react-dom";
import * as React from "react";

import App from "./app";

window.addEventListener("DOMContentLoaded", (): void => {
    ReactDOM.render(<App />, document.getElementById("app"));
});
