import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import SnapshotHierarchyBreadcrumb from 'in-components/SnapshotHierarchyBreadcrumb';

import './Header.less';

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <SnapshotHierarchyBreadcrumb snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default DashboardHeader;
