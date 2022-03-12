import React from 'https://unpkg.com/es-react@16.13.1/dev/react.js';
import ReactDOM from 'https://unpkg.com/es-react@16.13.1/dev/react-dom.js';

class App extends React.Component {
  render() {
    return <div className="App"><h1>Hello!</h1></div>;
  }
}

let setup = () => {
  return new Promise((resolve) =>
    resolve(null)
  );
};

let main = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

document.addEventListener('DOMContentLoaded', () => setup().then(main));
