import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {getClassName} from 'in-services/react';

import Tab from './Tab';

import './SidebarTabs.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-tabs';

export default getPhysicalHierarchy(
               React.createClass({

  displayName: 'SidebarTabs',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    className: rpt.string,
    physicalHierarchy: irpt.list
  },

  render() {
    const hierarchy = this.props.physicalHierarchy;
    if (!hierarchy || hierarchy.isEmpty()) {
      return null;
    }

    return (
      <ul className={getClassName(this, block)}>
        {hierarchy.map(childSnapshotId =>
          <Tab key={childSnapshotId}
               snapshotId={childSnapshotId}
               className={this.props.className + '__tab'}
               onClick={setSelectedSnapshotId}
               isSelected={this.props.snapshotId === childSnapshotId} />
        )}
      </ul>
    );
  }
}));
