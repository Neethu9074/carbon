import {combineLatest} from 'reactive-observables';

import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import FCP from 'in-map/singleMeshFactories/ContentProvider/FrameContentProvider';
import GroundStickyNote from 'in-map/components/stickyNotes/physical/Group';
import ColorComponent from 'in-map/sceneObjectComponents/ColorComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import createObjectCollection from 'in-map/stores/ObjectColletion';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotes';
import {getColorPool} from 'in-services/util/ColorGenerator';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import groups from 'in-map/stores/physical/groups';


export default class Group extends SceneObject {

  constructor(params) {
    super(params.id);

    this._cachedLabel = this.id;
    this.nodes = createObjectCollection();
  }

  init() {
    super.init();

    groups.add(this.id, this);
    stickyNotes.add(this.id, {
      type: GroundStickyNote,
      eventEmitter: this.eventEmitter,
      props: {
        id: this.id
      }
    });
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, FCP, 'lines'));

    this.addComponent('color', new ColorComponent(this, FCP, 'lines'));
    this.getComponent('color').set(getColorPool('groups').getColorRGB(this.id));

    this.addComponent('screenPosition', new ScreenPositionComponent(this));
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(combineLatest([
      this.eventEmitter.on('positionChanged'),
      this.eventEmitter.on('scaleChanged')
    ]).subscribe(([pos, scale]) => {
      const screenPosition = this.getComponent('screenPosition');
      screenPosition.set3DPositionToProject(pos.x, pos.y, pos.z + scale.z / 2);
    }));
  }

  addNode(id, node) {
    this.nodes.add(id, node);
  }

  removeNode(id) {
    this.nodes.remove(id);
  }

  getNodes() {
    return this.nodes.objects;
  }

  dispose() {
    super.dispose();

    groups.remove(this.id);

    this._cachedLabel = null;
  }
}
