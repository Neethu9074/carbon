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
import {getLabel, getIcon} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';
import enhance from '../hoc/enhance';
import ZoneTag from '../ZoneTag';
import HoverButton from '../HoverButton';
import Jail from '../Jail';
import Icon from '../Icon';
import Tabs from './Tabs';

import './SnapshotDetailSidebar.less';

const block = 'in-snapshot-detail-sidebar';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

const SnapshotDetailSidebar = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map,
    parentCoordinates: irpt.map,
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
        }),
        parentCoordinates: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysNullObservable;
            }
            return wiring.getParentNode(views.physical.hosts, snapshot);
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
          {this.renderNavigation()}

          <h1 className={block + '__label'}>
            {getLabel(snapshot)}
            <HealthIcon snapshot={snapshot}
                        className={block + '__health'}/>
            <ZoneTag snapshot={snapshot}
                     className={block + '__zone'}/>
          </h1>
          <p className={block + '__plugin-type'}>
            {getSingular(snapshot.get('pluginId'))}
          </p>

          <HoverButton icon='dashboard'
                       onClick={this.openDashboard}
                       className={block + '__open-dashboard'}>
            View Dashboard
          </HoverButton>

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

  renderNavigation() {
    if (this.props.parentCoordinates) {
      return (
        <div className={block + '__navigation'}>
          <Icon type='back'
                className={block + '__close'}
                onClick={() => selectedSnapshotStore.select(this.props.parentCoordinates)}/>
        </div>
      );
    } else if (this.props.snapshot) {
      return (
        <div className={block + '__navigation'}>
          <img src={getIcon(this.props.snapshot)}
               alt='Component icon'
               className={block + '__icon'}/>
        </div>
      );
    }

    return null;
  },

  renderTabs() {
    const hierarchy = this.props.hierarchy;
    if(!hierarchy) {
      return null;
    }

    return (
      <Tabs className={block + '__tabs'}
            onItemChanged={this.onItemChanged}
            snapshot={this.props.snapshot}>
        {hierarchy}
      </Tabs>
    );
  },

  onItemChanged(item) {
    selectedSnapshotStore.select(item);
  }
});

export default enhance(SnapshotDetailSidebar);
