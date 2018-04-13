/**
 * Stores the route and the labels for the back button breadcrumb item that takes the user back from analyze traces
 * to the last visited explore dashboard.
 */
class BackButtonStore {
  setRoute(route) {
    this.route = route;
  }

  getRoute() {
    return this.route;
  }

  setLabel1(label1) {
    this.label1 = label1;
  }

  getLabel1() {
    return this.label1;
  }

  setLabel2(label2) {
    this.label2 = label2;
  }

  getLabel2() {
    return this.label2;
  }
}

export default new BackButtonStore();
