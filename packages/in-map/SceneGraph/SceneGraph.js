/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import EmptySceneNode from 'in-map/SceneGraph/EmptySceneNode';
import MainSceneNode from 'in-map/SceneGraph/MainSceneNode';
import Scene from 'in-map/sceneObjects/Scene';

export default class SceneGraph {
  constructor(canvas, antialias, webGlContext) {
    this.root = webGlContext
      ? new MainSceneNode({
          id: 'mainScene',
          canvas,
          antialias,
          webGlContext,
          InstanceType: Scene
        })
      : // if there is no webgl context, gracefully setup an empty scene
        new EmptySceneNode({ id: 'emptyMainScene' });
  }

  dispose() {
    this.root.dispose();
    this.root = null;
  }
}
