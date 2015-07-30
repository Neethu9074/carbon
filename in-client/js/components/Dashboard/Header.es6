'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getIcon} from 'in-sdk/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import HealthIcon from 'in-components/HealthIcon';
import ZoneTag from 'in-components/ZoneTag';

import './Header.less';

const block = 'in-dashboard-header';

const DashboardHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation],

  propTypes: {
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;

    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'}/>

        <div>
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
        </div>

        <Button type='button'
                kind='default'
                onClick={this.closeDashboard}
                className={block + '__close'}>
          Back to map
        </Button>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }
});

export default DashboardHeader;
