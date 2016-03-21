import irpt from 'react-immutable-proptypes';
import React from 'react';

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

export default connectTo(
  () => {
    return {
      snapshot: selectedSnapshot,
      timeframe: timelineStore.timeframe
    };
  },
  React.createClass({
  displayName: 'Dashboard',

  propTypes: {
    snapshot: irpt.map,
    timeframe: React.PropTypes.object
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return <LoadingIndicator />;
    }

    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <div className={block}>
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
