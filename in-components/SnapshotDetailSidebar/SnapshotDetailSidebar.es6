/*global require:false*/
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import * as tracking from 'in-services/tracking';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';

import Jail from '../Jail';
import HealthIcon from '../HealthIcon';
import Button from '../Button';
import ZoneTag from '../ZoneTag';
import enhance from '../hoc/enhance';

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
  }
});

export default enhance(SnapshotDetailSidebar);
