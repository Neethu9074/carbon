export default class ParsingError extends Error {
  constructor(msg, row) {
    super(msg);
    this.row = row;
  }
}
