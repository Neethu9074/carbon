import {currentTooltip} from 'in-map/src/stores';

export default class TooltipHandler {

  constructor() {
    this.sub = currentTooltip.subscribe(tooltip => {
      if (this.tooltip === tooltip) {
        return;
      }

      if (this.tooltip) {
        this.tooltip.unMount();
      }
      this.tooltip = tooltip;
      if (tooltip) {
        tooltip.mount();
      }
    });
  }

  dispose() {
    this.sub.dispose();
    this.sub = null;
  }
}
