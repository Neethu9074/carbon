import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import FCP from 'in-map/singleMeshFactories/ContentProvider/FrameContentProvider';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import GroundStickyNote from 'in-map/components/stickyNotes/physical/Group';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import createObjectCollection from 'in-map/stores/ObjectCollection';
import {getColorPool} from 'in-services/util/ColorGenerator';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {groups} from 'in-map/stores/physical/groupsStore';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {eventBus} from 'in-map/services/eventBus';


export default class Group extends SceneObject {

  constructor(params) {
    super(params);

    this._cachedLabel = this.id;
    this.nodes = createObjectCollection();
  }

  init() {
    super.init();

    if (!isWebVRActive) {
      stickyNotes.add(this.id, {
        type: GroundStickyNote,
        eventEmitter: this.eventEmitter,
        props: {
          id: this.id
        }
      });
    }
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, FCP, 'lines'));

    if (!isWebVRActive) {
      this.addComponent('screenPosition', new ScreenPositionComponent(this, (pos, scale) => {
        return {
          x: pos.x,
          y: pos.y,
          z: pos.z + scale.z / 2
        };
      }));
    }

    this.getComponent('color').setColor(getColorPool('groups').getColorRGB(this.id));

    this.addComponent('snapshot', new SnapshotComponent(this));
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(this.eventEmitter.on('snapshotChanged').subscribe(snapshot => {
      this._cachedLabel = snapshot ? snapshot.getIn(['data', 'groupId']) : this._cachedLabel;
      eventBus.emit('layoutNeedsUpdate', true);
    }));
  }

  initialized() {
    super.initialized();

    groups.add(this.id, this);
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
    stickyNotes.remove(this.id);

    this._cachedLabel = null;
  }
}
