import createObjectCollection from 'in-map/stores/ObjectColletion';
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
