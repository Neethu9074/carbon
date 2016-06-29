import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  clearPosition,
  needsUpdate$,
  setPosition
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterYPositionStore';
import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import Tab from 'in-components/sidebars/components/Tab';
import {getClassName} from 'in-services/react';

import 'in-components/sidebars/components/SidebarTabs.less';


const rpt = React.PropTypes;
const block = 'in-sidebar-tabs';

export default getPhysicalHierarchy(React.createClass({

  displayName: 'SidebarTabs',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    physicalHierarchy: irpt.list,
    className: rpt.string
  },

  componentDidMount() {
    this.updateSubsctription = needsUpdate$.nextFrame().subscribe(() => {
      const sidebarTabs = this.refs.sidebarTabs;
      if (sidebarTabs) {
        setPosition(sidebarTabs.getBoundingClientRect().bottom);
      }
    });
  },

  componentWillUnmount() {
    this.updateSubsctription.dispose();
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
