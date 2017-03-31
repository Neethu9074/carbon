import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';

export default class TooltipComponent extends SceneObjectComponent {
  constructor(sceneObject, tooltipClass) {
    super(sceneObject, '_tooltip');

    this.tooltipClass = tooltipClass;
  }

  getTooltipClass() {
    return this.tooltipClass;
  }

  dispose() {
    super.dispose();

    this.tooltipClass = null;
  }
}
