import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';


export default class TooltipComponent extends SceneObjectComponent {

  constructor(sceneObject, TooltipClass) {
    super(sceneObject, '_tooltip');

    this.TooltipClass = TooltipClass;
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      this.sceneObject.eventEmitter.on('isHighlighted').distinct().subscribe(isHighlighted => {
        if (isHighlighted) {
          console.log('mount tooltip');
        }
      })
    );
  }

  dispose() {
    super.dispose();

    this.TooltipClass = null;
  }
}
