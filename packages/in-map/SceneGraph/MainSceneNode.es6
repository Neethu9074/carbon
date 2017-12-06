import ContainerMapNode from 'in-map/SceneGraph/container/MapNode';
import PhysicalMapNode from 'in-map/SceneGraph/physical/MapNode';
import LogicalMapNode from 'in-map/SceneGraph/logical/MapNode';
import { view$, types as views } from 'in-stores/view';
import Node from 'in-map/SceneGraph/Node';

export default class SceneNode extends Node {
  constructor(params) {
    super({ InstanceType: params.InstanceType, params });

    this.addSubscription(
      view$.subscribe(view => {
        // remove "all" other map since this view only fires if it has changed
        this.disposeChildren();

        if (view === views.physical) {
          this.addChild(PhysicalMapNode, { id: 'physicalMap' });
        } else if (view === views.logical) {
          this.addChild(LogicalMapNode, { id: 'logicalMap' });
        } else if (view === views.container) {
          this.addChild(ContainerMapNode, { id: 'containerMap' });
        }

        // add support for other views
      })
    );
  }
}
