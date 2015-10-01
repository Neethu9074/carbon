import React from 'react';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotDetailContent from 'in-components/SnapshotDetailContent';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import * as timelineStore from 'in-services/stores/timeline';
import {extractCoordinates} from 'in-services/snapshots';
import Jail from 'in-components/Jail';

import Navigation from './Navigation';
import Header from './Header';

import './Dashboard.less';

const block = 'in-dashboard';

const Dashboard = React.createClass({
  mixins: [SubscriptionMixin],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotCoordinates = extractCoordinates({
        pluginId: decodeURIComponent(params.pluginId),
        hostId: decodeURIComponent(params.hostId),
        steadyId: decodeURIComponent(params.steadyId)
      });
      selectedSnapshotStore.select(snapshotCoordinates);
    }
  },

  headers: [],

  getInitialState() {
    return {
      visibleSection: '',
      snapshot: null,
      timeframe: 0
    };
  },

  componentWillMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => {
        this.setState({snapshot});
      })
    );

    this.addSubscription(
      timelineStore.timeframe.subscribe(timeframe => {
        this.setState({timeframe});
      })
    );
  },

  render() {
    return (
      <div className={block}>
        {this.renderSidebar()}

        <div className={block + '__graphs'} ref='content'>
          <Header snapshot={this.state.snapshot}/>

          {this.renderNavigation()}
          {this.renderDashboard()}
        </div>

      </div>
    );
  },

  renderSidebar() {
    if (!this.state.snapshot) {
      return <LoadingIndicator />;
    }

    return (
      <div className={block + '__sidebar'}>
        <SnapshotDetailContent className={block + '__siderbar-content'}
                               snapshot={this.state.snapshot}
                               useDetailedInformation={true}/>;
      </div>
    );
  },

  renderNavigation() {
    const jail = this.getJail();
    if (!jail) {
      return null;
    }
    const oldScrollValue = jail.scrollTop;
    this.setScrolling(0);
    const currentHeaders = document.getElementsByClassName('in-dashboard__content-heading') || [];
    this.headers = [];
    for (let i = 0; i < currentHeaders.length; i++) {
      const header = currentHeaders[i];
      this.headers.push({
        element: header,
        label: header.textContent,
        _cachedTop: header.getBoundingClientRect().top
      });
    }
    this.setScrolling(oldScrollValue);

    return (
      <Navigation>
        {this.headers.map(item => {
          const text = item.label;
          return (
            <Navigation.Item key={text}
                             label={text}
                             isVisible={this.state.visibleSection === text}
                             onClick={() => this.jumpToSection(item)}/>
          );
        })}
      </Navigation>
    );
  },

  jumpToSection(item) {
    const jail = this.getJail();
    if (jail) {
      jail.scrollTop = item._cachedTop - 140;
    }
  },

  getJail() {
    const jails = document.getElementsByClassName(block + '__sections');
    if (!jails || jails.length === 0) {
      return null;
    }
    return jails[0];
  },

  setScrolling(value) {
    const jail = this.getJail();
    if (jail) {
      jail.scrollTop = value;
    }
  },

  onScroll() {
    for (let i = 0; i < this.headers.length; i++) {
      const header = this.headers[i];
      const boundings = header.element.getBoundingClientRect();
      // since the header list is sorted, the first hit is the right to take
      if (boundings.top >= 0) {
        this.setState({ visibleSection: header.label });
        return;
      }
    }
  },

  renderDashboard() {
    if (!this.state.snapshot) {
      return <LoadingIndicator />;
    }

    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <Jail component={DashboardImpl}
            className={block + '__sections'}
            onScroll={this.onScroll}
            props={{
              snapshot: this.state.snapshot,
              timeframe: this.state.timeframe
            }} />
    );
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.state.snapshot;
    return getForgeComponent(
      './' +
      snapshot.get('pluginId') +
      '/Dashboard/' +
      name +
      '.es6'
    );
  }

});

export default Dashboard;
