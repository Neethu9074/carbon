import {combineLatest} from 'reactive-observables';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {width, height} from 'in-map/stores/indexStore';
import {eventBus} from 'in-map/services/eventBus';
import {scene$} from 'in-map/stores/sceneStore';
import {ZERO} from 'in-map/misc/fixedVectors';


const IS_VISIBLE_CHANGED_KEY = 'isVisibleChanged';
const SCREEN_POSITION_CHANGED_KEY = 'screenPositionChanged';

export default class ScreenPositionComponent extends SceneObjectComponent {

  constructor(sceneObject, get3DPositionToProject) {
    super(sceneObject, '_screenPosition');

    this.get3DPositionToProjectCallback = get3DPositionToProject;

    this.screenPositionAnchor = ZERO.clone();
    this.screenPosition = {x: 0, y: 0};
    this.wasInView = false;
    this.isVisibleChangedKey = IS_VISIBLE_CHANGED_KEY + sceneObject.id;
    this.positionChangedKey = SCREEN_POSITION_CHANGED_KEY + sceneObject.id;

    // send initial signal
    this.emitToClient(this.isVisibleChangedKey, this.wasInView);
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;

    scene$.once(scene => {
      if (scene) {
        this.camera = scene.camera;

        this.addSubscriptions([
          eventBus.on('willRenderObject').subscribe(() => this.updateScreenPosition()),

          combineLatest([
            eventEmitter.on('positionChanged'),
            eventEmitter.on('scaleChanged')
          ]).subscribe(([pos, scale]) =>
            this.set3DPositionToProject(this.get3DPositionToProjectCallback
                                          ? this.get3DPositionToProjectCallback(pos, scale)
                                          : pos)
          )
        ]);
      }
    });
  }

  set3DPositionToProject(pos) {
    this.screenPositionAnchor.copy(pos);
  }

  updateScreenPosition() {
    const camera = this.camera;

    const screenPosition = this.screenPositionAnchor
      .clone()
      .applyProjection(camera.getRenderableCamera().projection);

    screenPosition.x = ((screenPosition.x + 1) / 2 * width) | 0;
    screenPosition.y = (-(screenPosition.y - 1) / 2 * height) | 0;

    if (this.screenPosition.x !== screenPosition.x || this.screenPosition.y !== screenPosition.y) {
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
    return (screenPos.x > 0 && screenPos.x <= width &&
            screenPos.y > 0 && screenPos.y <= height);
  }

  dispose() {
    super.dispose();

    this.screenPositionAnchor = null;
    this.screenPosition = null;
    this.isInView = null;
    this.camera = null;
  }
}
