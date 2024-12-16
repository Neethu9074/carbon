/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { view$, types as views } from 'in-infrastructure/perspectives/view';
import ContainerMapNode from 'in-map/SceneGraph/container/MapNode';
import PhysicalMapNode from 'in-map/SceneGraph/physical/MapNode';
import Node from 'in-map/SceneGraph/Node';

export default class SceneNode extends Node {
  constructor(params) {
    super({ InstanceType: params.InstanceType, params });

    this.addSubscription(
      view$.subscribe(view => {
        // remove "all" other map since this view only fires if it has changed
        this.disposeChildren();

        if (view === views.physical) {
          this.addChild(PhysicalMapNode, {
            id: 'physicalMap',
            adaptToDevicePixelRatio: params.adaptToDevicePixelRatio
          });
        } else if (view === views.container) {
          this.addChild(ContainerMapNode, {
            id: 'containerMap',
            adaptToDevicePixelRatio: params.adaptToDevicePixelRatio
          });
        }

        // add support for other views
      })
    );
  }
}
