'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';
import Button from '../UnknownNodeButton';

import './index.less';


/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired,
    showIp: React.PropTypes.bool.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    let formattedBytes;

    return (
      <div className='in-sticky-note__note__unknown-node--stack-wrapper'>
        <div className='in-sticky-note__note__unknown-node--stack-children'>
          {this.props.showIp ?
            null :
            <Button/>
          }
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteUnknownNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__unknown-node'});

    this.showIp = true;

    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC
        snapshot={this.parent.snapshot}
        showIp={this.showIp}/>,
      this.stickyNoteContainer
    );
  }

  showPlus(value=true) {
    this.showIp = !value;
    this.render();
  }
}
