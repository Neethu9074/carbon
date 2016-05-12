import irpt from 'react-immutable-proptypes';
import React from 'react';

import {isCollapsed$} from 'in-components/timeline/timelineStore';
import LoadingIndicator from 'in-components/LoadingIndicator';
import SidebarDashboard from 'in-components/SidebarDashboard';
import getForgeComponent from 'in-services/getForgeComponent';
import {selectedSnapshot} from 'in-stores/snapshot';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Jail from 'in-components/Jail';

import Navigation from './Navigation';
import Header from './Header';

import './Dashboard.less';


const block = 'in-dashboard';

export default connectTo({
    snapshot: selectedSnapshot,
    timeframe: timelineStore.timeframe,
    isTimelineCollapsed: isCollapsed$
  },
  React.createClass({
  displayName: 'Dashboard',

  propTypes: {
    snapshot: irpt.map,
    timeframe: timelineStore.timeframeShape,
    isTimelineCollapsed: React.PropTypes.bool.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return <LoadingIndicator />;
    }

    let classes = block;
    if (!this.props.isTimelineCollapsed) {
      classes += ` ${block}--timeline-open`;
    }

    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <div className={classes}>
        <SidebarDashboard snapshot={snapshot}/>

        <div className={block + '__graphs'} ref='content'>
          <Header snapshot={snapshot}/>
          <Navigation snapshot={snapshot}/>
          <Jail component={DashboardImpl}
                className={block + '__sections'}
                props={{ snapshot, timeframe: this.props.timeframe }}/>
        </div>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.props.snapshot;
    return getForgeComponent(
      './' +
      snapshot.get('plugin') +
      '/Dashboard/' +
      name +
      '.es6'
    );
  }
}));
