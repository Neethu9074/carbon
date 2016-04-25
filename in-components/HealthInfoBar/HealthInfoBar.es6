import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getHealthInfo} from 'in-stores/healthInfo';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './HealthInfoBar.less';


const block = 'in-health-info-bar';
const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfo(props.snapshotId)
    };
  },
  React.createClass({

    displayName: 'HealthInfoBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshotId: rpt.string.isRequired,
      healthInfo: irpt.map
    },

    render() {
      const healthInfo = this.props.healthInfo;
      if (!healthInfo) {
        return null;
      }

      const maxSeverity = healthInfo.get('maxSeverity');
      const backgroundColor = theme.health[Math.floor(maxSeverity)];
      const numberOfOpenEvents = healthInfo.get('numberOfOpenEvents');

      const style = {
        width: maxSeverity * 10 + '%',
        backgroundColor
      };

      return (
        <div className={block}>
          <div className={block + '__outer'}>
            <div className={block + '__inner'}
            style={style}>
            </div>
          </div>

          {numberOfOpenEvents > 0 ?
            <span className={block + '__counter'}
                  style={{
                    color: maxSeverity < 0.6 ? '#000' : '#fff',
                    backgroundColor
                  }}>
              {numberOfOpenEvents}
            </span> :
            null}
        </div>
      );
    }
  })
);
