import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {setSelectedSnapshotId} from 'in-stores/snapshot';

import './SnapshotLink.less';

const rpt = React.PropTypes;
const block = 'in-snapshot-link';

export default React.createClass({
  displayName: 'SnapshotLink',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    children: rpt.any
  },

  onClick() {
    setSelectedSnapshotId(this.props.snapshotId);
  },

  render() {
    return (
      <span className={block}
            onClick={this.onClick}>
        {this.props.children}
      </span>
    );
  }
});
