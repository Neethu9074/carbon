/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import { getFactory } from 'in-map/stores/factoriesStore';

export default class MeshComponent extends SceneObjectComponent {
  constructor(sceneObject, contentProvider, factoryId) {
    super(sceneObject, '_mesh');

    this.factory = getFactory(factoryId);
    this.fragment = createFragment(this.id, sceneObject, contentProvider);
    this.factory.add(this.fragment);
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;

    const updateFactoryCallback = this.updateFactory.bind(this);
    this.addSubscriptions([
      eventEmitter.on('transformationChanged').subscribe(updateFactoryCallback),
      eventEmitter.on('colorChanged').subscribe(updateFactoryCallback)
    ]);
  }

  updateFactory() {
    this.factory.needsUpdate();
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();

    this.fragment = null;
    this.factory = null;
  }
}
