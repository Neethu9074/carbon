import Subscriber from 'in-map/misc/Subscriber';


export default class Module extends Subscriber {

  constructor(params) {
    super();

    this.eventEmitter = params.eventEmitter;
    this.client = params.client;
    this.canvas = params.canvas;
    this.camera = params.camera;
    this.scene = params.scene;
    this.map = params.map;
  }
}
