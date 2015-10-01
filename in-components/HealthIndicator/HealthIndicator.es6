import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getClassName} from 'in-services/react';

import './HealthIndicator.less';

const rpt = React.PropTypes;
const block = 'in-healthindicator';

const HealthIndicator = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    size: rpt.number.isRequired,
    className: rpt.string
  },

  render() {
    const width = this.props.size ? this.props.size : 100;
    const progress = Math.random();

    return (
      <div className={getClassName(this, block)}
           style={{width}}>
        <div className={block + '__progress'}
             style={{width: width * progress}}/>
      </div>
    );
  }
});

export default HealthIndicator;
