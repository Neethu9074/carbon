import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import getForgeComponent from 'in-services/getForgeComponent';
import * as timelineStore from 'in-services/stores/timeline';
import * as tracking from 'in-services/tracking';
import {getClassName} from 'in-services/react';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';

import HoverButton from '../HoverButton';
import enhance from '../hoc/enhance';
import Header from './Header';
import Jail from '../Jail';
import Tabs from './Tabs';

import './SnapshotDetailContent.less';

const block = 'in-snapshot-detail-sidebarcontent';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const SnapshotDetailContent = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation
  ],

  propTypes: {
    useDetailedInformation: React.PropTypes.bool,
    className: React.PropTypes.string,
    hierarchy: React.PropTypes.array,
    snapshot: irpt.map.isRequired
  },

  statics: {
    createObservables() {
      return {
        hierarchy: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysEmptyArrayObservable;
            }
            return wiring.getAllStepsBetweenNodeAndLeaf(views.physical.hosts, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  getInitialState() {
    return { timeframe: 0 };
  },

  componentWillMount() {
    this.addSubscription(
      timelineStore.timeframe.subscribe(timeframe => {
        this.setState({ timeframe });
      })
    );
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        {this.renderTabs()}

        <Header snapshot={this.props.snapshot}/>
        {this.renderHoverButton()}
        {this.renderSnapshotDetails()}
      </div>
    );
  },

  renderHoverButton() {
    return (
      <HoverButton icon='dashboard'
                   onClick={this.openDashboard}
                   className={this.getMixedClassName('__open-dashboard')}>
        View Dashboard
      </HoverButton>
    );
  },

  renderSnapshotDetails() {
    return (
      <div className={this.getMixedClassName('__content')}
           style={{ maxHeigt: window.height }}>
        <Jail component={this.getForgeSpecificComponent('Details')}
              props={{
                snapshot: this.props.snapshot,
                timeframe: this.state.timeframe
              }}/>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    const path = this.props.useDetailedInformation ?
      './' + pluginId + '/Dashboard/Sidebar.es6' :
      './' + pluginId + '/Sidebar/' + name + '.es6';

    return getForgeComponent(path);
  },

  openDashboard() {
    const snapshot = this.props.snapshot;
    tracking.trackEvent(tracking.events.openingADashboardUsingTheSidebar);
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
  },

  renderTabs() {
    const hierarchy = this.props.hierarchy;
    if (!hierarchy) {
      return null;
    }

    return (
      <Tabs className={this.getMixedClassName('__tabs')}
            onItemChanged={this.onItemChanged}
            snapshot={this.props.snapshot}>
        {hierarchy}
      </Tabs>
    );
  },

  onItemChanged(item) {
    selectedSnapshotStore.select(item);
  },

  getMixedClassName(postAppend) {
    return this.props.className ?
      block + postAppend + ' ' + this.props.className + postAppend :
      block + postAppend;
  }
});

export default enhance(SnapshotDetailContent);
