import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIcon} from 'in-sdk/snapshot';

import {iconSize} from '../../../stores/mapStore';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState() {
    return {size: 16};
  },

  componentDidMount() {
    this.addSubscription(iconSize.subscribe(size => this.setState({size})));
  },

  render() {
    const icon = getIcon(this.props.snapshot);
    const size = Math.max(this.state.size * 0.25, 16);
    const style = {width: size + 'px', height: size + 'px'};

    return (
      <div style={style} className='in-sticky-note__icon-background'>
        {icon ?
          <img src={icon} className='in-sticky-note__icon-svg'/> : null}
      </div>
    );
  }
});
