/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default class HealthComponent extends SceneObjectComponent {
  constructor(sceneObject, lazy = false) {
    super(sceneObject, '_health');

    this.isLazy = lazy;

    // send initial health event because the backend subscription doesn't return if there is no health
    this.healthChanged(null);
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

            this.refreshHealthSubscription();
          }
        });
    } else {
      this.refreshHealthSubscription();
    }
  }

  refreshHealthSubscription() {
    this.disposeEvents();

    const healthChangedCallback = this.healthChanged.bind(this);
    this.addSubscription(this.getHealth().subscribe(healthChangedCallback));
  }

  getHealth() {
    const healthInfo = get(this.sceneObject, ['entity', 'healthInfo']);
    if (healthInfo) {
      return just(fromJS(healthInfo));
    }
    if (healthInfo === null) {
      return just(null);
    }
    return getHealthInfoAtFocusedMoment(this.sceneObject.id);
  }

  healthChanged(health) {
    this.emitToClient('healthChanged', health);
  }

  dispose() {
    super.dispose();

    if (this.visibleSubscription) {
      this.visibleSubscription.dispose();
      this.visibleSubscription = null;
    }
  }
}
