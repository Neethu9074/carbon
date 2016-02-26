import React from 'react';
import irpt from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import SnapshotHierarchyBreadcrumb from 'in-components/SnapshotHierarchyBreadcrumb';

import './Header.less';

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <SnapshotHierarchyBreadcrumb snapshotId={this.props.snapshot.get('id')} />
      </div>
    );
  }
});

export default DashboardHeader;
