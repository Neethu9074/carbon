'use strict';

import React from 'react/addons';
import eventBus from 'instana-ui-services/eventbus';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {getIcon} from 'instana-ui-sdk/snapshot';
import {iconSizeStore as iss} from '../../../stores/NodeIconStore';

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
    return {size: 50};
  },

  componentDidMount() {
    this.addSubscription(iss.subscribe(size => this.setState({size})));
  },

  render() {
    const icon = getIcon(this.props.snapshot);
    const size = this.state.size * 0.4 + 'px';
    const style = {width: size, height: size};

    return (
      <div style={style} className='in-sticky-note__icon-background'>
        {icon ?
          <img src={icon} className='in-sticky-note__icon-svg'/> : null}
      </div>
    );
  }
});
