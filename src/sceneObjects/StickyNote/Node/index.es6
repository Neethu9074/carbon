'use strict';

import React from 'react/addons';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import iconPath from '../icons/default.png';
import StickyNote from '../StickyNote';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    return (
      <div>
        <div className="in-sticky-note__node__id">
          {this.props.snapshot.get('hostId')}
        </div>
        <div >
          <img src={iconPath} className="in-sticky-note__node__icon"/>
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});
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
