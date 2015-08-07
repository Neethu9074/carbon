'use strict';

import React from 'react/addons';
import StickyNote from '../StickyNote';
import UnknownNodeButton from '../UnknownNodeButton';

import './index.less';

const UnknownNodeStickyRC = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired,
    showIp: React.PropTypes.bool.isRequired,
    onPlusClicked: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className='in-sticky-note__note__unknown-node--stack-wrapper'>
        <div className='in-sticky-note__note__unknown-node--stack-children'>
          {this.props.showIp ?
            null :
            <UnknownNodeButton onPlusClicked={this.props.onPlusClicked} />
          }
        </div>
      </div>
    );
  }
});

export default class StickyNoteUnknownNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__unknown-node'});

    this.showIp = true;

    this.render();
  }

  render() {
    React.render(
      <UnknownNodeStickyRC
        snapshot={this.parent.snapshot}
        showIp={this.showIp}
        onPlusClicked={this.onPlusClicked.bind(this)}/>,
      this.stickyNoteContainer
    );
  }

  onPlusClicked() {
    this.parent.scene.onPlusClicked();
  }

  showPlus() {
    this.showIp = false;
    this.render();
  }

  hidePlus() {
    this.showIp = true;
    this.render();
  }
}
