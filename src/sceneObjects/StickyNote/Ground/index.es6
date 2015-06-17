'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div>
        {this.props.label}
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note-group'});
    this.updateWorldPos();
    this.render();
  }

  updateWorldPos() {
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.copy(this.parent.getPosition());
    worldPos.z += this.parent.size.z / 2;
  }

  render() {
    React.render(
      <StickyNoteRC label={this.parent.id} />,
      this.stickyNoteContainer
    );
  }
}
