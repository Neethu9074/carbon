import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';

import SidebarHeadingSnapshotMetadata from '../SidebarHeadingSnapshotMetadata';
import SidebarHeadingNavigation from '../SidebarHeadingNavigation';
import SidebarDetailList from '../SidebarDetailList';
import SidebarTabs from '../SidebarTabs';
import enhance from '../hoc/enhance';

import './SidebarMap.less';

const block = 'in-sidebar-map';

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

const SidebarMap = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: irpt.map
  },

  statics: {
    createObservables() {
      return {
        snapshot: selectedSnapshotStore.selectedSnapshot,
        parentCoordinates: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysNullObservable;
            }
            return wiring.getParentNode(views.physical, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  getInitialState: function() {
    return { windowHeight: this.getWindowHeight() };
  },

  handleResize: function() {
    this.setState({ windowHeight: this.getWindowHeight() });
  },

  getWindowHeight() {
    // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
    // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
    return Math.max(100, window.innerHeight - 350);
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
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
          <SidebarHeadingNavigation.BackToHostButton snapshot={snapshot}/>
        </SidebarHeadingNavigation>

        <SidebarHeadingSnapshotMetadata snapshot={snapshot}
                                        className={block + '__heading'}/>

        <SidebarDetailList snapshot={snapshot}
                           className={block + '__detail-list'}
                           style={{ maxHeight: this.state.windowHeight }}/>
      </div>
    );
  }
});

export default enhance(SidebarMap);
