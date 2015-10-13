import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIcon} from 'in-sdk/snapshot';

import {iconSize} from '../../../mapStores';

import './NodeIcon.less';

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
    const size = Math.max(this.state.size * 0.5, 16) + 'px';
    return (
      <div style={{ width: size }}
           className='in-sticky-note__icon-background'>
        {icon ?
          <img src={icon}
               className='in-sticky-note__icon-svg'
               style={{ maxHeight: size }}/> : null}
      </div>
    );
  }
});
