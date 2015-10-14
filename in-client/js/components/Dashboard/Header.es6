import React from 'react/addons';

import SnapshotHierarchyBreadcrumb from 'in-components/SnapshotHierarchyBreadcrumb';

import './Header.less';

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <div className={block}>
        <SnapshotHierarchyBreadcrumb />
      </div>
    );
  }
});

export default DashboardHeader;
