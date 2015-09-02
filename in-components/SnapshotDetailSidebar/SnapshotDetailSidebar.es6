/*global require:false*/
import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as tracking from 'in-services/tracking';
import {getSingular} from 'in-sdk/pluginName';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';
import enhance from '../hoc/enhance';
import ZoneTag from '../ZoneTag';
import Button from '../Button';
import Jail from '../Jail';
import Tabs from './Tabs';

import './SnapshotDetailSidebar.less';

const block = 'in-snapshot-detail-sidebar';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const SnapshotDetailSidebar = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map,
    hierarchy: React.PropTypes.array
  },

  statics: {
    createObservables() {
      return {
        snapshot: selectedSnapshotStore.selectedSnapshot,
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
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        {this.renderTabs()}

        <div className={block + '__content'}>
          <div className={block + '__navigation'}>
            <h2 className={block + '__title'}>
              {getSingular(snapshot.get('pluginId'))}
            </h2>

            <Button type='button'
                    className={block + '__open-dashboard'}
                    onClick={this.openDashboard}>
              View Dashboard
            </Button>
          </div>

          <div className={block + '__heading'}>
            <h1 className={block + '__label'}>
              {getLabel(snapshot)}
              <HealthIcon snapshot={snapshot}
                          className={block + '__health'}/>
            </h1>
            <ZoneTag snapshot={snapshot}
                     className={block + '__zone'}/>
          </div>

          {this.renderSnapshotDetails()}
        </div>
      </div>
    );
  },

  renderSnapshotDetails() {
    const DetailsFromForge = this.getForgeSpecificComponent('Details');
    return (
      <Jail component={DetailsFromForge} props={{
        snapshot: this.props.snapshot
      }} />
    );
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    return require(
      'in-forge/' +
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
    const hierarchy = this.props.hierarchy;
    if(!hierarchy) {
      return null;
    }

    return (
      <Tabs className={block + '__tabs'}
            onItemChanged={this.onItemChanged}>
        {hierarchy}
      </Tabs>
    );
  },

  onItemChanged(item) {
    selectedSnapshotStore.select(item);
  }
});

export default enhance(SnapshotDetailSidebar);
