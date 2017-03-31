import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';

export default class EventsGraphRenderer extends BasicRenderer {
  constructor(backBuffer, scale, height) {
    super(backBuffer, scale);

    this.height = height;
  }

  setWidth(width) {
    this.width = width;
  }

  draw() {}
}
