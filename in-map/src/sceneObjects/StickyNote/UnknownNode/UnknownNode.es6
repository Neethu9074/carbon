import React from 'react/addons';

import StickyNote from '../StickyNote';
import iconPath from './plusIcon.svg';

import './UnknownNode.less';

const rpt = React.PropTypes;
const block = 'in-sticky-note__unknown-node';

const UnknownNodeStickyRC = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    onClicked: rpt.func.isRequired,
    snapshot: rpt.object.isRequired,
    showIp: rpt.bool.isRequired
  },

  render() {
    if (this.props.showIp) {
      return null;
    }
    return (
      <img src={iconPath}
           className={block + '__icon'}
           onClick={this.props.onClicked} />
    );
  }
});

export default class StickyNoteUnknownNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.showIp = true;
    this.render();
  }

  render() {
    React.render(
      <UnknownNodeStickyRC
        snapshot={this.parent.snapshot}
        showIp={this.showIp}
        onClicked={this.onClicked.bind(this)}/>,
      this.stickyNoteContainer
    );
  }

  onClicked() {
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
