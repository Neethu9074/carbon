import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './Entity.less';


const block = 'in-table-view-entity';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Entity',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.props.snapshotId}
      </div>
    );
  }
});
