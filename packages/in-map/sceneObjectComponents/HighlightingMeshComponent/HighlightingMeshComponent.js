/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import { getFactory } from 'in-map/stores/factoriesStore';

export default class HighlightingMeshComponent extends SceneObjectComponent {
  constructor(sceneObject, contentProvider, factoryId = 'highlighting', eventToListen = 'isHighlighted') {
    super(sceneObject, '_highlighting');

    this.contentProvider = contentProvider;
    this.eventToListen = eventToListen;
    this.factoryId = factoryId;
    this.factory = getFactory(factoryId);
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;
    const highlightingChangedCallback = this.highlightingChanged.bind(this);
    const updateFactoryCallback = this.updateFactory.bind(this);

    this.addSubscriptions([
      eventEmitter.on('transformationChanged').subscribe(updateFactoryCallback),
      eventEmitter
        .on(this.eventToListen)
        .distinct()
        .subscribe(highlightingChangedCallback)
    ]);
  }

  highlightingChanged(isHighlighted) {
    if (isHighlighted) {
      this.factory.add(createFragment(this.id, this.sceneObject, this.contentProvider));
    } else {
      this.factory.remove(this.id);
    }
    this.factory.needsUpdate();
  }

  updateFactory() {
    this.factory.needsUpdate();
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();
    this.factory = null;

    this.contentProvider = null;
    this.eventToListen = null;
    this.factoryId = null;
  }
}
