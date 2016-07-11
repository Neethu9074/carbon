import ReactDOM from 'react-dom';
import React from 'React';

import Root from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/Root';
import {viewStructure} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

const ProcessViewRenderTreeWrapper = connectTo({
    root: viewStructure
}, function ProcessViewRenderTree({root}) {
  if (!root) {
    return null;
  }
  return (
    <Root>
      {root.get('children')}
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
