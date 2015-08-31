/*global require:false*/
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as tracking from 'in-services/tracking';
import * as wiring from 'in-services/wiring';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';
import enhance from '../hoc/enhance';
import ZoneTag from '../ZoneTag';
import Button from '../Button';
import Jail from '../Jail';
import Tabs from './Tabs';

import './SnapshotDetailSidebar.less';

const block = 'in-snapshot-detail-sidebar';

const SnapshotDetailSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation],

  propTypes: {
    snapshot: irpt.map
  },

  statics: {
    createObservables() {
      return {
        snapshot: selectedSnapshotStore.selectedSnapshot
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
    tracking.trackEvent(tracking.events.openingADashboardUsingTheSidebar);
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(this.props.snapshot.get('pluginId')),
        steadyId: encodeURIComponent(this.props.snapshot.get('steadyId')),
        hostId: encodeURIComponent(this.props.snapshot.get('hostId'))
      }
    );
  },

  renderTabs() {
    console.log(wiring);

    return (
      <Tabs className={block + '__tabs'}
            onItemChanged={this.onItemChanged}>
        {'wat'}
        {'geht'}
      </Tabs>
    );
  },

  onItemChanged(item) {
    switch (item) {
      case 'wat':
        console.log('EY WAT EY');
        break;
      case 'geht':
        console.log('NIX');
        break;
      default:
    }
  }
});

export default enhance(SnapshotDetailSidebar);
