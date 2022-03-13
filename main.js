import React, { useState } from 'https://unpkg.com/es-react@16.13.1/dev/react.js';
import ReactDOM from 'https://unpkg.com/es-react@16.13.1/dev/react-dom.js';
import * as csv_parse from "https://www.unpkg.com/csv-parse@5.0.4/dist/esm/sync.js";
// const pasteHandler = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
//   event.currentTarget.style.border = "5px solid purple";
//   event.currentTarget.style.backgroundColor = "orange";
//   console.log(event.clipboardData.getData("text"));
//   // Transform the copied/cut text to upper case
//   event.currentTarget.value = event.clipboardData
//     .getData("text")
//     .toUpperCase();
//   console.log(event.clipboardData.getData("text"));
//   event.preventDefault();
// };
// Cheap for now, only support first 26 columns
let COLUMNS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
class Client {
    data;
    constructor(tsv_data) {
        this.data = csv_parse.parse(tsv_data, {
            delimiter: "\t",
            trim: true,
        });
    }
    cell(name) {
        let column = COLUMNS.indexOf(name[0].toUpperCase());
        // -1 because Excel rows index by 1
        let row = parseInt(name.substring(1)) - 1;
        return this.data[row][column];
    }
    name = () => this.cell('B1');
    insurer = () => this.cell('B2');
    deductable = () => this.cell('B3');
    copay = () => this.cell('B4');
    effectiveDate = () => this.cell('B5');
    perSessionCharge = () => this.cell('B6');
    otherInsured = () => this.cell('B7');
    sessions() {
        return (this.data
            .map(row => row.slice(2, 8))
            .filter(row => row.some(cell => cell != ""))
            .map(([date, who, charge, date_filed, date_paid, paid_amount]) => {
            return { date, who, charge, date_filed, date_paid, paid_amount };
        }));
    }
    unfiledSessions = () => this.sessions().filter(({ date_filed }) => date_filed === "");
}
let App = (props) => {
    const [pasteData, setPasteData] = useState(null);
    var content = React.createElement("div", null, "Page failed to render :(");
    if (pasteData != null) {
        let client = new Client(pasteData);
        console.log(client);
        content = React.createElement("div", null,
            React.createElement("h2", null, client.name()),
            React.createElement("table", null,
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Date"),
                        React.createElement("th", null, "Who"),
                        React.createElement("th", null, "Charge"))),
                React.createElement("tbody", null, client.unfiledSessions().map((s, i) => React.createElement("tr", { key: i },
                    React.createElement("td", null, s.date),
                    React.createElement("td", null, s.who),
                    React.createElement("td", null, s.charge))))));
    }
    else {
        content = React.createElement("div", null,
            React.createElement("h1", null, "NL Consulting Invoice Generator"),
            React.createElement("b", null,
                React.createElement("ol", null,
                    React.createElement("li", null, "Select the sheet you want to bill"),
                    React.createElement("li", null, "Control-A then Control-C to copy the whole sheet"),
                    React.createElement("li", null, "Come back here"),
                    React.createElement("li", null, "Control-V to create an invoice"),
                    React.createElement("li", null, "Control-P to print or save to PDF!"),
                    React.createElement("li", null, "If desired, paste new data here to re-generate."))));
    }
    return React.createElement("div", { className: "App", onPaste: (e) => setPasteData(e.clipboardData.getData("text")) }, content);
};
let setup = () => {
    return new Promise((resolve) => resolve(null));
};
let main = () => {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
};
document.addEventListener('DOMContentLoaded', () => setup().then(main));