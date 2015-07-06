/*global require:false*/

'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {IntlMixin} from 'react-intl';
import {Navigation} from 'react-router';

import {clear} from 'instana-ui-services/stores/selectedSnapshot';
import Icon from 'instana-ui-components/Icon';

import './Details.less';

const block = 'in-sidebar-details';

const Details = React.createClass({
  mixins: [
    IntlMixin,
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__navigation'}>
          <Icon type='arrow_left'
                onClick={clear}
                className={block + '__back'}/>

          <h2 className={block + '__title'}>
            Server Details
          </h2>
        </div>

        <div className={block + '__content'}>
          {this.renderSnapshotDetails()}
        </div>

        <div className={block + '__open-dashboard-wrapper'}>
          <button type='button'
                  className={block + '__open-dashboard'}
                  onClick={this.openDashboard}>
            {this.getIntlMessage('map.sidebar.switchToDashboard')}
          </button>
        </div>
      </div>
    );
  },

  renderSnapshotDetails() {
    /*eslint-disable no-unused-vars*/
    const DetailsFromForge = this.getForgeSpecificComponent('Details');
    return <DetailsFromForge snapshot={this.props.snapshot} />;
    /*eslint-enable no-unused-vars*/
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    return require('../forge/' + pluginId + '/Sidebar/' + name);
  },

  openDashboard() {
    this.transitionTo(
      'dashboard',
      {
        pluginId: this.props.snapshot.get('pluginId'),
        steadyId: this.props.snapshot.get('steadyId'),
        hostId: this.props.snapshot.get('hostId')
      }
    );
  }
});

export default Details;
