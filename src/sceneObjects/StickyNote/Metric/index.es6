'use strict';


import React from 'react/addons';

import StickyNote from '../StickyNote';

import './index.less';

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    //const numProcesses = this.props.numProcesses;
    const style = {height: this.props.height};
    const value = this.props.value;
    const component = (
      <div className='in-sticky-note-process__container' style={style}>
        <div className='in-sticky-note-process__content'>
           -- metric: {value}
        </div>
      </div>
    );

    return component;
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteMetric extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-metric'});
    this.updateWorldPos();
    this.render();
  }

  updateWorldPos() {
    const cube = this.parent.cube;
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.set(0, 0, 1);
    worldPos.applyMatrix4(cube.matrixWorld);

    worldPos.y = cube.scale.y / 2;
  }

  render(value = 0) {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} value={value} />,
      this.stickyNoteContainer
    );
  }
}
