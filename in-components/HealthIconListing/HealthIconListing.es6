import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getHealthInfo} from 'in-stores/healthInfo';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import EventsListing from './EventsListing';

import './HealthIconListing.less';


const block = 'in-health-listing';
const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfo(props.snapshotId)
    };
  },
  React.createClass({

    displayName: 'HealthIconListing',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshotId: rpt.string.isRequired,
      className: rpt.string,
      healthInfo: irpt.map
    },

    render() {
      const healthInfo = this.props.healthInfo;
      if (!healthInfo || healthInfo.get('numberOfOpenEvents') === 0) {
        return null;
      }

      const maxSeverity = healthInfo.get('maxSeverity');
      const backgroundColor = theme.health[Math.floor(maxSeverity)];

      return (
        <Tooltip align={{horizontal: 'right'}}
                 content={<EventsListing snapshotId={this.props.snapshotId} />}>
          <div className={block}
               style={{backgroundColor}}>
            {healthInfo.get('numberOfOpenEvents')}
          </div>
        </Tooltip>
      );
    }
  })
);
