import PhysicalMapNode from 'in-map/SceneGraph/physical/AsciiMapNode';
import AsciiScene from 'in-map/sceneObjects/AsciiScene';
import { view$, types as views } from 'in-stores/view';
import Node from 'in-map/SceneGraph/Node';

export default class SceneNode extends Node {
  constructor(params) {
    super({ InstanceType: AsciiScene, params });

    this.addSubscription(
      view$.subscribe(view => {
        // remove "all" other map since this view only fires if it has changed
        this.disposeChildren();

        if (view === views.physical) {
          this.addChild(PhysicalMapNode, { id: 'physicalMap' });
        }

        // add support for other views
      })
    );
  }
}
