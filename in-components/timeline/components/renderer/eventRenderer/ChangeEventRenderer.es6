import EventRenderer from 'in-components/timeline/components/renderer/eventRenderer/EventRenderer';


export default class ChangeEventRenderer extends EventRenderer {

  constructor(buffer, scale, iconSize) {
    super(buffer, scale, 120, iconSize);
  }
}
