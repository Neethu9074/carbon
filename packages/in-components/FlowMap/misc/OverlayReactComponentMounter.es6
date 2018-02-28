import ReactDOM from 'react-dom';
import React from 'react';

import Controls from 'in-components/FlowMap/components/Controls/Controls';
import Nodes from 'in-components/FlowMap/components/Nodes/Nodes';

export default class OverlayReactComponentMounter {
  constructor(nodesReactComponentWrapper, serviceLocatorUid) {
    this.nodesReactComponentWrapper = nodesReactComponentWrapper;
    this.serviceLocatorUid = serviceLocatorUid;
  }

  update(rootNodeId) {
    ReactDOM.render(
      [
        <Nodes key="nodesOverlay" serviceLocatorUid={this.serviceLocatorUid} rootNodeId={rootNodeId} />,
        <Controls key="controls" serviceLocatorUid={this.serviceLocatorUid} />
      ],
      this.nodesReactComponentWrapper
    );
  }

  dispose() {}
}
