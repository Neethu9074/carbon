export default class ParsingError extends Error {
  constructor(row, char) {
    super(`Unexpected character at row ${row}: ${char}`);
    this.row = row;
    this.char = char;
  }
}
