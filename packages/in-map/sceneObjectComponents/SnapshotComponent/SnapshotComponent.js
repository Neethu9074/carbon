/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getSnapshot } from 'in-stores/snapshot';

export default class SnapshotComponent extends SceneObjectComponent {
  constructor(sceneObject, alternativeId, lazy = false) {
    super(sceneObject, '_snapshot');

    this.alternativeId = alternativeId;
    this.isLazy = lazy;
  }

  initEvents() {
    super.initEvents();

    if (this.isLazy) {
      this.visibleSubscription = this.sceneObject.eventEmitter
        .on('isVisibleChanged' + this.sceneObject.id)
        .debounce(200)
        .nextFrame()
        .subscribe(isVisible => {
          if (isVisible) {
            this.visibleSubscription.dispose();
            this.visibleSubscription = null;
            this.refreshSnapshotSubscription();
          }
        });
    } else {
      this.refreshSnapshotSubscription();
    }
  }

  refreshSnapshotSubscription() {
    this.disposeEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscription(this.getSnapshotOrPreview().subscribe(snapshotChangedCallback));
  }

  getSnapshotOrPreview() {
    const snapshot = get(this.sceneObject, ['entity', 'snapshotPreview']);
    if (snapshot) {
      return just(fromJS(snapshot));
    }
    return getSnapshot(this.alternativeId ? this.alternativeId : this.sceneObject.id);
  }

  snapshotChanged(snapshot) {
    this.emitToClient('snapshotChanged', snapshot);
  }

  dispose() {
    super.dispose();

    if (this.visibleSubscription) {
      this.visibleSubscription.dispose();
      this.visibleSubscription = null;
    }
  }
}
