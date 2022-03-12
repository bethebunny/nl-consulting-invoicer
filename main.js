import React from 'https://unpkg.com/es-react@16.13.1/dev/react.js';
import ReactDOM from 'https://unpkg.com/es-react@16.13.1/dev/react-dom.js';
class App extends React.Component {
    render() {
        return React.createElement("div", { className: "App" },
            React.createElement("h1", null, "Hello!"));
    }
}
let setup = () => {
    return new Promise((resolve) => resolve(null));
};
let main = () => {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
};
document.addEventListener('DOMContentLoaded', () => setup().then(main));
//# sourceMappingURL=main.js.map