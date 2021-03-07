export default class Connection {
    line: Number;

    direction: String;

    departure: String;

    public constructor(line: Number, direction: String, departure: String) {
      this.line = line;
      this.direction = direction.replace('Bocklemünd', 'Bockl.') || direction.replace('Rochusplatz', 'Rochu.');
      this.departure = departure.includes("Min") ? departure.replace(' Min', 'm') : departure.replace("Sofort", "0m");
    }

    /**
     * toString
     */
    public toString() {
      return `${this.line} ${this.direction} ${this.departure}`;
    }
}