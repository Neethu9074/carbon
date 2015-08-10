import {health} from 'in-services/health';

import Component from '../Component';

/*eslint-disable max-len*/
import VATOCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/VertexArrayToObjectContentManipulator';
import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';
/*eslint-enable max-len*/


export default class NodeGroundComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject);

    this.healthToSet = health.ok;
    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};

    this.geometryProviderGround = new CMCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          x: 1.5, y: 1, z: 1.5,
          contentProvider: new PCP()
        })
      })
    });

    this.geometryProviderGroundLine = new VATOCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          x: 1.5, y: 1, z: 1.5,
          contentProvider: new FCP()
        })
      })
    });

    this.updateProvider();
    this.initialized();
  }

  onInitialEnter() {
    this.updateVisibility();
  }

  onInactiveEnter() {
    this.sceneObject.scene.groundSingleMeshFactory.removeFragment(this.getID());
    this.sceneObject.scene.lineFactory.removeFragment(this.getID());
  }


  positionChanged(x, y, z) {
    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if(scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.changeXyzOf(this.scaleToSet, x, y, z);
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  healthChanged(newHealth) {
    const oldHealth = this.healthToSet;
    if(oldHealth === newHealth) {
      return;
    }

    this.healthToSet = newHealth;
    this.needsUpdate = true;
  }

  update() {
    this.updateProvider();

    if(this.isActive()) {
      this.updateVisibility();
    }
    this.needsUpdate = false;
  }

  updateProvider() {
    const pos = this.positionToSet;
    const color = this.sceneObject.calculateNodeColor(this.healthToSet);
    const x = pos.x - 0.5;
    const y = pos.y;
    const z = pos.z + 0.5;

    const cmcmGround = this.geometryProviderGround;
    const pcmGround = cmcmGround.contentProvider;

    pcmGround.position = {x, y, z};
    cmcmGround.color = {r: color.r, g: color.g, b: color.b};

    const vatocmGroundLine = this.geometryProviderGroundLine;
    const pcmGroundLine = vatocmGroundLine.contentProvider;
    pcmGroundLine.contentProvider.scale = pcmGround.contentProvider.scale;
    pcmGroundLine.position = {x, y: y + 0.025, z};
  }

  updateVisibility() {
    const id = this.getID();
    const scene = this.sceneObject.scene;
    const lineFactory = scene.lineFactory;
    const groundFactory = scene.groundSingleMeshFactory;

    if(this.healthToSet === health.ok) {
      groundFactory.removeFragment(id);
      lineFactory.removeFragment(id);

    } else {
      const color = this.sceneObject.calculateNodeColor(this.healthToSet);
      groundFactory.addFragment({id, contentProvider: this.geometryProviderGround});

      lineFactory.addFragment({
        id,
        points: this.geometryProviderGroundLine.getVertices(),
        color});
    }
  }

  getID() {
    return this.sceneObject.id + '_ground';
  }

  dispose() {
    super.dispose();

    const id = this.getID();
    const scene = this.sceneObject.scene;
    scene.lineFactory.removeFragment(id);
    scene.groundSingleMeshFactory.removeFragment(id);
  }
}
