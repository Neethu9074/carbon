'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getIcon} from 'in-sdk/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import Button from 'in-components/Button';

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

        <div className={block + '__description'}>
          <h1>
            {getLabel(snapshot)}
          </h1>
          <p>
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
