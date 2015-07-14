'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {iconSizeStore as iss} from '../../../stores/mapStore';
import iconPath from './plusIcon.svg';

import './index.less';

export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  getInitialState() {
    return {size: 16};
  },

  componentDidMount() {
    this.addSubscription(iss.subscribe(size => this.setState({size})));
  },

  render() {
    const size = Math.max(this.state.size * 0.4, 16);
    const style = {width: size + 'px', height: size + 'px'};

    return (
      <img src={iconPath}
           className='in-sticky-note__unknown-node--icon'
           style={style}/>
    );
  }
});
