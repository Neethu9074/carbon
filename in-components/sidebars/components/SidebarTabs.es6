import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {clearPosition, setPosition} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterYPositionStore';
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
    physicalHierarchy: irpt.list,
    className: rpt.string
  },

  componentDidUpdate() {
    const sidebarTabs = this.refs.sidebarTabs;
    if (sidebarTabs) {
      setPosition(sidebarTabs.getBoundingClientRect().bottom);
    }
  },

  componentWillUnmount() {
    clearPosition();
  },

  render() {
    const hierarchy = this.props.physicalHierarchy;
    if (!hierarchy || hierarchy.isEmpty()) {
      return null;
    }

    return (
      <ul className={getClassName(this, block)}
          ref='sidebarTabs'>
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
