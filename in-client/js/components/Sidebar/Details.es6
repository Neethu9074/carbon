/*global require:false*/

'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {IntlMixin} from 'react-intl';
import {Navigation} from 'react-router';

import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import HealthIcon from 'in-components/HealthIcon';
import Button from 'in-components/Button';
import ZoneTag from 'in-components/ZoneTag';
import {clear} from 'in-services/stores/selectedSnapshot';
import Icon from 'in-components/Icon';

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
    const snapshot = this.props.snapshot;

    return (
      <div className={block}>
        <div className={block + '__navigation'}>
          <Icon type='arrow_left'
                onClick={clear}
                className={block + '__back'}/>

          <h2 className={block + '__title'}>
            {getSingular(snapshot.get('pluginId'))}
          </h2>

          <Button type='button'
                  className={block + '__open-dashboard'}
                  onClick={this.openDashboard}>
            {this.getIntlMessage('map.sidebar.switchToDashboard')}
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


        <div className={block + '__content'}>
          {this.renderSnapshotDetails()}
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
    return require(
      'in-forge/' +
      pluginId +
      '/Sidebar/' +
      name +
      '.es6'
    );
  },

  openDashboard() {
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

export default Details;
