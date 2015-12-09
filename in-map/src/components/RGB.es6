export default class RGB {

  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  set(r = this.r, g = this.g, b = this.b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  dispose() {
    this.r = null;
    this.g = null;
    this.b = null;
  }
}
