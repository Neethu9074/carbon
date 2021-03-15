/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import FCP from 'in-map/singleMeshFactories/ContentProvider/FrameContentProvider';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import GroundStickyNote from 'in-map/components/stickyNotes/physical/Group';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import { showSticky$ } from 'in-map/stores/physical/groupsStore';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { groups } from 'in-map/stores/physical/groupsStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { eventBus } from 'in-map/services/eventBus';
import { getLabel } from 'in-sdk/snapshot';

export default class Group extends SceneObject {
  constructor(params) {
    super(params);

    this._cachedLabel = this.id;
    this.nodes = new Map();
    eventBus.emit('layoutNeedsUpdate', true);
  }

  init() {
    super.init();

    stickyNotes.add(this.id, {
      type: GroundStickyNote,
      props: {
        id: this.id,
        eventEmitter: this.eventEmitter,
        showSticky$
      }
    });
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, FCP, 'lines'));

    this.addComponent(
      'screenPosition',
      new ScreenPositionComponent(this, (pos, scale) => {
        return {
          x: pos.x,
          y: pos.y,
          z: pos.z + scale.z / 2
        };
      })
    );

    this.getComponent('color').setHex(getColorPool('groups').getColorHex(this.id));

    this.addComponent('snapshot', new SnapshotComponent(this));
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscription(this.eventEmitter.on('snapshotChanged').subscribe(snapshotChangedCallback));
  }

  initialized() {
    super.initialized();

    groups.add(this.id, this);
  }

  snapshotChanged(snapshot) {
    this._cachedLabel = snapshot ? getLabel(snapshot) : this._cachedLabel;
    eventBus.emit('layoutNeedsUpdate', true);
  }

  addNode(id, node) {
    this.nodes.set(id, node);
  }

  removeNode(id) {
    this.nodes.delete(id);
  }

  dispose() {
    super.dispose();

    groups.remove(this.id);
    stickyNotes.remove(this.id);

    this._cachedLabel = null;
  }
}
