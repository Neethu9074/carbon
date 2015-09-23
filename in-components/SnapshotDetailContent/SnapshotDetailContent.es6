import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import getForgeComponent from 'in-services/getForgeComponent';
import * as tracking from 'in-services/tracking';
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
    Navigation
  ],

  propTypes: {
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

  render() {
    const snapshot = this.props.snapshot;
    return (
      <div className={block}>
        {this.renderTabs()}

        <Header snapshot={snapshot}/>

        <HoverButton icon='dashboard'
                     onClick={this.openDashboard}
                     className={block + '__open-dashboard'}>
          View Dashboard
        </HoverButton>

        {this.renderSnapshotDetails()}
      </div>
    );
  },

  renderSnapshotDetails() {
    return (
      <div className={block + '__content'}>
        <Jail component={this.getForgeSpecificComponent('Details')}
              props={{ snapshot: this.props.snapshot }}/>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    return getForgeComponent(
      './' +
      pluginId +
      '/Sidebar/' +
      name +
      '.es6'
    );
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
    return (
      <Tabs className={block + '__tabs'}
            onItemChanged={this.onItemChanged}
            snapshot={this.props.snapshot}>
        {this.props.hierarchy}
      </Tabs>
    );
  },

  onItemChanged(item) {
    selectedSnapshotStore.select(item);
  }
});

export default enhance(SnapshotDetailContent);
