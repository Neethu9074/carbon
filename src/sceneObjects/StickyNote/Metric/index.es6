'use strict';


import React from 'react/addons';

import StickyNote from '../StickyNote';

import './index.less';

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    const style = {height: this.props.height};
    const value = this.props.value;
    const component = (
      <div className='in-sticky-note-layer__container' style={style}>
        <div className='in-sticky-note-layer__content'>
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

  render(value = 0) {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} value={value} />,
      this.stickyNoteContainer
    );
  }
}
