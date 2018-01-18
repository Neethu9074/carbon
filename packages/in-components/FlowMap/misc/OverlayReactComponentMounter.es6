import ReactDOM from 'react-dom';
import React from 'react';

import Controls from 'in-components/FlowMap/components/Controls/Controls';
import Nodes from 'in-components/FlowMap/components/Nodes/Nodes';

export default class OverlayReactComponentMounter {
  constructor(nodesReactComponentWrapper, serviceLocatorUid) {
    this.nodesReactComponentWrapper = nodesReactComponentWrapper;

    ReactDOM.render(
      [
        <Nodes key="nodesOverlay" serviceLocatorUid={serviceLocatorUid} />,
        <Controls key="controls" serviceLocatorUid={serviceLocatorUid} />
      ],
      nodesReactComponentWrapper
    );
  }

  dispose() {
    ReactDOM.unmountComponentAtNode(this.nodesReactComponentWrapper);
  }
}
