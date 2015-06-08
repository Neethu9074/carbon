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
    const component = (
      <div className='in-sticky-note-process__container' style={style}>
        <div className='in-sticky-note-process__content'>
           -- process
        </div>
      </div>
    );

    return component;
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-process'});
    this.updateWorldPos();
    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
