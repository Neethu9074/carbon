// import * as time from '../timeCalculations';

export default class AdaptiveDetailHandler {

  constructor() {
    this.checkInterval = setInterval(() => {
      // const fps = time.getFPS();
      // console.log(fps);
    },
    1000);
  }

  dispose() {
    clearInterval(this.checkInterval);
    this.checkInterval = null;
  }
}
