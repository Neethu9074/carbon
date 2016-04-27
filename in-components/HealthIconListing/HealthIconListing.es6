import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import TooltipFrame from 'in-components/Tooltips/Frame';
import EventListing from 'in-components/EventListing';
import {getHealthInfo} from 'in-stores/healthInfo';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

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
        <Tooltip content={<TooltipFrame>
                            <EventListing snapshotId={this.props.snapshotId}/>
                          </TooltipFrame>}
                 align={{horizontal: 'right'}}>
          <div className={block}
               style={{backgroundColor}}>
            {healthInfo.get('numberOfOpenEvents')}
          </div>
        </Tooltip>
      );
    }
  })
);
