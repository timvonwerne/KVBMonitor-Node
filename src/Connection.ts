export default class Connection {
    line: Number;

    direction: String;

    departure: String;

    public constructor(line: Number, direction: String, departure: String) {
      this.line = line;
      this.direction = direction;
      this.departure = departure;
    }

    /**
     * toString
     */
    public toString() {
      return `${this.line} ${this.direction} ${this.departure}`;
    }
}