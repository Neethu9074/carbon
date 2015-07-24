'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import Stan from 'instana-ui-components/Stan';

import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {create} from 'instana-ui-services/conveyer';
import {plugins} from 'instana-ui-forge/constants';

import './index.less';

const block = 'in-stan-explains';
const rpt = React.PropTypes;

const StanExplainsThings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    style: rpt.object,
    className: rpt.string,
    header: rpt.string.isRequired,
    children: rpt.string.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  componentDidMount() {
    const observable = create(SnapshotConveyer, {pluginId: plugins.os});
    this.addSubscription(observable.subscribe(data => {
      if(data.size === 0) {
        this.setState({open: true});
      } else {
        if(this.state.open) {
          this.setState({open: false});
        }
      }
    }));
  },

  render() {
    let classes = this.props.className ?
      block + ' ' + this.props.className :
      block;

    return (
      <div className={classes} style={this.props.style}>
        <span className={block + '__header'}>
          {this.props.header}
        </span>
        <span className={block + '__content'}>
          {this.props.children}
        </span>
        <Stan />
      </div>
    );
  }
});

export default StanExplainsThings;
