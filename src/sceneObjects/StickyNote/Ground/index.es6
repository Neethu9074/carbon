'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';
import {getColor} from 'instana-ui-sdk/zones';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className="in-sticky-note__group__content"
           style={{backgroundColor: this.props.color}}>
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
      <StickyNoteRC label={this.parent.id}
                    color={getColor(this.parent.id) || '#0F0F0F'} />,
      this.stickyNoteContainer
    );
  }
}
