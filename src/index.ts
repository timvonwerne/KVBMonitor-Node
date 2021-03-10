import path from 'path';
import osmosis from 'osmosis';
import moment from 'moment';
import LedMatrix from 'easybotics-rpi-rgb-led-matrix';
import Connection from './Connection';

const config: {
  updateInterval: number,
  stationID: number,
  matrixRows: number,
  matrixCols: number,
} = {
  updateInterval: 10000,
  stationID: 632,
  matrixRows: 32,
  matrixCols: 64,
};

const matrix = new LedMatrix(config.matrixRows, config.matrixCols);
const font = path.join(__dirname, '../fonts/4x6.bdf');

let date: String;
let time: String;
let connections: Array<Connection>;

/**
 * Get and set the date and time objects.
 */
function setDateTime() {
  date = moment().format('D.MM.');
  time = moment().format('H:mm');
}

/**
 * Get current departures from KVB website.
 */
function getDepartures() {
  return new Promise((resolve, reject) => {
    const response: Array<Connection> = [];

    osmosis
      .get(`https://kvb.koeln/qr/${config.stationID}`)
      .find('#qr_ergebnis > tr')
      .set({
        line: 'td:first-child',
        direction: 'td:nth-child(2)',
        departure: 'td:last-child',
      })
      .data((res) => response.push(new Connection(Number(res.line), res.direction, res.departure)))
      .error((err) => reject(err))
      .done(() => resolve(response));
  });
}

/**
 * Process departures and make sure only relevant connections are shown.
 */
function processDepartures(departures: Array<Connection>) {
  connections = [];

  departures.forEach((d: Connection) => {
    if (d.direction === 'Bocklemünd' || d.direction === 'Rochusplatz') {
      d.direction = `${d.direction.substring(0, 5)}.`;
      connections.push(d);
    }
  });
}

/**
 * Display all information on matrix.
 */
function display() {
  setDateTime();
  matrix.clear();
  matrix.drawText(2, 2, date, font, 255, 165, 0); // Draw the date
  matrix.drawText(43, 2, time, font, 255, 165, 0);

  getDepartures().then((res: any) => {
    processDepartures(res);
    let yMargin = 13;

    if (connections) {
      connections.forEach(((conn: Connection) => {
        matrix.drawText(2, yMargin, conn.toString(), font, 255, 165, 0);
        console.log(`Drawing ${conn} with yMargin of ${yMargin}`);
        yMargin += 10;
      }));

      matrix.update();
    } else {
      console.error('No connections set. Not updating matrix.');
    }
  }).catch((err) => {
    console.error(`Failed to get departures: ${err}`);
  });
}

/**
 * Setup for initial displaying and updating.
 */
display();
setInterval(display, config.updateInterval);
