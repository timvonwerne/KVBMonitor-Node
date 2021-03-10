export default class Connection {
    line: number;

    direction: string;

    departure: string;

    public constructor(line: number, direction: string, departure: string) {
      this.line = line;
      this.direction = direction;
      this.departure = departure.includes('Min') ? departure.replace(' Min', 'm') : departure.replace('Sofort', '0m');
    }

    /**
     * toString
     */
    public toString() {
      return `${this.line} ${this.direction} ${this.departure}`;
    }
}
