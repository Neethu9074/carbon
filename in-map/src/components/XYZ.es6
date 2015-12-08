export default class XYZ {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x = this.x, y = this.y, z = this.z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new XYZ(this.x, this.y, this.z);
  }

  dispose() {
    this.x = null;
    this.y = null;
    this.z = null;
  }
}
