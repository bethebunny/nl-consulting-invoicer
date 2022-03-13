import React, { useState } from 'https://unpkg.com/es-react@16.13.1/dev/react.js';
import ReactDOM from 'https://unpkg.com/es-react@16.13.1/dev/react-dom.js';
import * as csv_parse from "https://www.unpkg.com/csv-parse@5.0.4/dist/esm/sync.js";

// Cheap for now, only support first 26 columns
let COLUMNS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface Session {
  date: string
  who: string
  charge: string
  date_filed: string
  date_paid: string
  paid_amount: string
}


class Client {
  data: string[][]
  constructor(tsv_data: string) {
    this.data = csv_parse.parse(tsv_data, {
      delimiter: "\t",
      trim: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
    })
  }

  cell(name: string): string {
    let column = COLUMNS.indexOf(name[0].toUpperCase());
    // -1 because Excel rows index by 1
    let row = parseInt(name.substring(1)) - 1;
    return this.data[row][column];
  }

  name = (): string => this.cell('B1');
  insurer = (): string => this.cell('B2');
  deductable = (): string => this.cell('B3');
  copay = (): string => this.cell('B4');
  effectiveDate = (): string => this.cell('B5');
  perSessionCharge = (): string => this.cell('B6');
  otherInsured = (): string => this.cell('B7');

  sessions(): Session[] {
    return (this.data
      .map(row => row.slice(2, 8))
      .filter(row => row.some(cell => cell != ""))
      .map(([date, who, charge, date_filed, date_paid, paid_amount]) => {
        return {date, who, charge, date_filed, date_paid, paid_amount};
      })
    );
  }

  unfiledSessions = (): Session[] => this.sessions().filter(({date_filed}) => date_filed === "")
}

let invoiceTotal = (sessions: Session[]): number => (
  sessions
    .map(s => Number(s.charge.replace(/[^0-9.-]+/g, '') || '0'))
    .reduce((a, b) => a + b, 0)
);

let App = ({defaultData}) => {
  const [pasteData, _setPasteData] = useState(defaultData || null);
  var content = <div>Page failed to render :(</div>;

  let setPasteData = (data: string) => {
    let url = new URL(window.location.href);
    url.searchParams.set('data', btoa(data));
    window.history.pushState({}, '', url);
    _setPasteData(data);
  }
  if (pasteData != null) {
    let client = new Client(pasteData);
    let unfiledSessions = client.unfiledSessions();
    let total = invoiceTotal(unfiledSessions);
    content = <div>
      <h2>NL Consulting Invoice for {client.name()}</h2>
      <b>Invoice date: {new Date().toJSON().slice(0, 10)}</b>
      <table>
        <thead><tr><th>Date</th><th>Who</th><th>Charge</th></tr></thead>
        <tbody>
          {unfiledSessions.map((s, i) => <tr key={i}>
            <td>{s.date}</td>
            <td>{s.who}</td>
            <td>{s.charge}</td>
          </tr>)}
        </tbody>
      </table>
      <h3>Invoice total: ${total}</h3>
      <p>Please make checks payable to NL Consulting.</p>
      </div>;
  } else {
    content = <div>
      <h1>NL Consulting Invoice Generator</h1>
        <b>
          <ol>
            <li>Select the sheet you want to bill</li>
            <li>Control-A then Control-C to copy the whole sheet</li>
            <li>Come back here</li>
            <li>Control-V to create an invoice</li>
            <li>Control-P to print or save to PDF!</li>
            <li>If desired, paste new data here to re-generate.</li>
          </ol>
        </b>
    </div>;
  }
  return <div className="App" onPaste={(e) => setPasteData(e.clipboardData.getData("text"))}>{content}</div>;
}

let setup = () => {
  return new Promise((resolve) =>
    resolve(null)
  );
};

let main = () => {
  let searchParams = new URLSearchParams(window.location.search);
  let data = searchParams.has('data')? atob(searchParams.get('data')) : null;
  ReactDOM.render(<App defaultData={data} />, document.getElementById("root"));
};

document.addEventListener('DOMContentLoaded', () => setup().then(main));
