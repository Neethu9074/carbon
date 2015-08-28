import {hexToRGBNormalized} from 'in-services/converters';
import eventBus from 'in-services/eventbus';
import {getColor} from 'in-sdk/zones';

import LineMeshComponent from '../../../components/LineMeshComponent';

import StickyNote from '../../StickyNote/Ground';
import BaseGroup from '../BaseGroup';

import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Group extends BaseGroup {

  constructor({parent, id}) {
    super({parent, id});

    this.stickyNote = new StickyNote(this);

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
  }

  initComponents() {
    super.initComponents();

    const id = this.id;
    const color = hexToRGBNormalized(getColor(id) || 0xFFFFFF);
    const components = this.components;

    //add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      id,
      sceneObject: this,
      factory: this.scene.lineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.mesh.colorChanged(color.r, color.g, color.b);
  }

  update() {
    this.updateScreenPosition();

    if(this.isInView()) {
      this.stickyNote.update();
    } else {
      this.stickyNote.hide();
    }
  }

  updateScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    super.setScreenPositionAnchor(pos.x, pos.y, pos.z + this.zSize / 2);
  }

  positionChanged(x, y, z) {
    this.getComponent('mesh').positionChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  setScale(x, y, z) {
    super.setScale(x, y, z);

    this.getComponent('mesh').sizeChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  dispose() {
    super.dispose();

    if(this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }
  }
}
