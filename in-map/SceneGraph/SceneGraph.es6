import EmptySceneNode from 'in-map/SceneGraph/EmptySceneNode';
import MainSceneNode from 'in-map/SceneGraph/MainSceneNode';


export default class SceneGraph {

  constructor(canvas, antialias, webGlContext) {
    this.root = webGlContext
      ? new MainSceneNode({
          id: 'mainScene',
          canvas,
          antialias,
          webGlContext
        })
      // if there is no webgl context, gracefully setup an empty scene
      : new EmptySceneNode({ id: 'emptyMainScene' });
  }

  dispose() {
    this.root.dispose();
    this.root = null;
  }
}
