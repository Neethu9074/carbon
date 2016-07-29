import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {eventBus} from 'in-map/services/eventBus';
import {scene$} from 'in-map/stores/sceneStore';
import {ZERO} from 'in-map/misc/fixedVectors';


const IS_VISIBLE_CHANGED_KEY = 'isVisibleChanged';
const SCREEN_POSITION_CHANGED_KEY = 'screenPositionChanged';

export default class ScreenPositionComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_screenPosition');

    this.screenPositionAnchor = ZERO.clone();
    this.screenPosition = {x: 0, y: 0};
    this.wasInView = false;
    this.isVisibleChangedKey = IS_VISIBLE_CHANGED_KEY + sceneObject.id;
    this.positionChangedKey = SCREEN_POSITION_CHANGED_KEY + sceneObject.id;

    // send initial signal
    this.emitToClient(this.isVisibleChangedKey, this.wasInView);

    scene$.once(scene => {
      if (scene) {
        this.camera = scene.camera;

        this.addSubscription(eventBus.on('willRenderObject').subscribe(() => this.updateScreenPosition()));
      }
    });
  }

  set3DPositionToProject(x, y, z) {
    this.screenPositionAnchor.set(x, y, z);
  }

  updateScreenPosition(force = false) {
    const camera = this.camera;
    const width = camera.width;
    const height = camera.height;

    const screenPosition = this.screenPositionAnchor
      .clone()
      .applyProjection(camera.getRenderableCamera().projection);

    screenPosition.x = (screenPosition.x + 1) / 2 * width;
    screenPosition.y = -(screenPosition.y - 1) / 2 * height;

    if (force || (this.screenPosition.x !== screenPosition.x || this.screenPosition.y !== screenPosition.y)) {
      this.screenPosition.x = screenPosition.x;
      this.screenPosition.y = screenPosition.y;

      this.update();
    }
  }

  update() {
    const isInView = this.isInView();
    if (isInView) {
      this.emitToClient(this.positionChangedKey, this.screenPosition);
    }

    if (isInView && !this.wasInView) {
      this.emitToClient(this.isVisibleChangedKey, true);
    } else if (!isInView && this.wasInView) {
      this.emitToClient(this.isVisibleChangedKey, false);
    }

    this.wasInView = isInView;
  }

  isInView() {
    const screenPos = this.screenPosition;
    const camera = this.camera;

    return (screenPos.x > 0 && screenPos.x <= camera.width &&
            screenPos.y > 0 && screenPos.y <= camera.height);
  }

  dispose() {
    super.dispose();

    this.screenPositionAnchor = null;
    this.screenPosition = null;
    this.isInView = null;
    this.camera = null;
  }
}
