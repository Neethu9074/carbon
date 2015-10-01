import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIcon} from 'in-sdk/snapshot';

import './NodeIcon.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    size: rpt.number.isRequired
  },

  render() {
    const icon = getIcon(this.props.snapshot);
    const size = Math.max(this.props.size * 0.5, 16);
    const style = {width: size + 'px', height: size + 'px'};

    return (
      <div style={style} className='in-sticky-note__icon-background'>
        {icon ?
          <img src={icon} className='in-sticky-note__icon-svg'/> : null}
      </div>
    );
  }
});
