import ReactDOM from 'react-dom';
import React from 'react';

import Root from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/Root';
import viewStructure$ from 'in-map/src/stores/process/viewStructure';
import connectTo from 'in-hoc/connectTo';

const ProcessViewRenderTreeWrapper = connectTo({
    structure: viewStructure$
}, function ProcessViewRenderTree({structure}) {
  if (!structure) {
    return null;
  }
  return (
    <Root>
      {structure.viewStructure.get('children')}
    </Root>
  );
});

export default class ProcessViewRenderTree {

  constructor() {
    const container = this.container = document.createElement('div');
    this.parent = document.getElementById('main');
    this.parent.appendChild(container);
    ReactDOM.render(
      <ProcessViewRenderTreeWrapper />,
      container
    );
  }

  dispose() {
    const container = this.container;
    ReactDOM.unmountComponentAtNode(container);
    this.parent.removeChild(container);
  }
}
