import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  clearPosition,
  needsUpdate$,
  setPosition
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterYPositionStore';
import getPhysicalHierarchy from 'in-hoc/getPhysicalHierarchy';
import Tab from 'in-components/sidebars/components/Tab';

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
      <ul className={block}
          ref='sidebarTabs'>
        {hierarchy.map(childSnapshotId =>
          <Tab key={childSnapshotId}
               snapshotId={childSnapshotId}
               isSelected={this.props.snapshotId === childSnapshotId} />
        )}
      </ul>
    );
  }
}));
