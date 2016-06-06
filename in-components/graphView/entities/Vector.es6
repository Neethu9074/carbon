export default class Vector {

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static random() {
    return new Vector(
      10.0 * (Math.random() - 0.5),
      10.0 * (Math.random() - 0.5),
      10.0 * (Math.random() - 0.5)
    );
  }

  add(v2) {
    return new Vector(
      this.x + v2.x,
      this.y + v2.y,
      this.z + v2.z
    );
  }

  subtract(v2) {
    return new Vector(
      this.x - v2.x,
      this.y - v2.y,
      this.z - v2.z
    );
  }

  multiply(n) {
    return new Vector(
      this.x * n,
      this.y * n,
      this.z * n
    );
  }

  divide(n) {
    // Avoid divide by zero errors..
    return new Vector(
      (this.x / n) || 0,
      (this.y / n) || 0,
      (this.z / n) || 0
    );
  }

  magnitude() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z
    );
  }

  normalise() {
    return this.divide(this.magnitude());
  }
}
