import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import connectTo from 'in-hoc/connectTo';
import getSelectedSnapshot from 'in-hoc/getSelectedSnapshot';

import SidebarHeadingSnapshotMetadata from '../SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from '../SidebarHeadingNavigation';
import SidebarDetailList from '../SidebarDetailList';
import SidebarTabs from '../SidebarTabs';

import './SidebarMap.less';

const block = 'in-sidebar-map';

export default getSelectedSnapshot(connectTo(
  () => {
    // TODO add ELEVATORE!
    return {
    };
  },
  React.createClass({
  displayName: 'SidebarMap',

  mixins: [
    React.addons.PureRenderMixin
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
    // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
    // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
    return Math.max(100, window.innerHeight - 350);
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
        <SidebarTabs snapshot={snapshot}
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
})));
