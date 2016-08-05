import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';


export default class TooltipComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_tooltip');
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      this.sceneObject.eventEmitter.on('isHighlighted').distinct().subscribe(isHighlighted => {
        console.log(isHighlighted);
      })
    );
  }
}
