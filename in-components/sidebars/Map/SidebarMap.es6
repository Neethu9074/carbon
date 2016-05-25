import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import SidebarHeadingSnapshotMetadata from 'in-components/sidebars/components/SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from 'in-components/sidebars/components/SidebarHeadingNavigation';
import SidebarDetailList from 'in-components/sidebars/components/SidebarDetailList';
import SidebarTabs from 'in-components/sidebars/components/SidebarTabs';
import getSelectedSnapshot from 'in-hoc/getSelectedSnapshot';

import 'in-components/sidebars/Map/SidebarMap.less';


const block = 'in-sidebar-map';

export default getSelectedSnapshot(React.createClass({
  displayName: 'SidebarMap',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string,
    snapshot: irpt.map,
    parentCoordinates: irpt.list
  },

  getInitialState() {
    return { windowHeight: this.getWindowHeight() };
  },

  handleResize() {
    this.setState({ windowHeight: this.getWindowHeight() });
  },

  getWindowHeight() {
    // the sidebar is minumum 100px height but max fullWindowHeight - 480px.
    // 480 is the upper margin + headers for the sidebar + a little margin to the bottom
    return Math.max(100, window.innerHeight - 480);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <SidebarTabs snapshotId={this.props.snapshotId}
                     className={block + '__tabs'}/>

        <SidebarHeadingNavigation snapshot={snapshot}
                                  className={block + '__heading-navigation'}>
          <SidebarHeadingNavigation.ViewDashboardButton snapshot={snapshot}/>
        </SidebarHeadingNavigation>

        <SidebarHeadingSnapshotMetadata snapshot={snapshot}
                                        className={block + '__heading'}/>

        <SidebarDetailList snapshot={snapshot}
                           className={block + '__detail-list'}
                           style={{ maxHeight: this.state.windowHeight }}/>
      </div>
    );
  }
}));
