'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {create} from 'instana-ui-services/conveyer';
import {IntlMixin} from 'react-intl';

import Dialog from '../Dialog';
import StanExplainsThings from '../StanExplainsThings';

const NoNodesDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    IntlMixin
  ],

  propTypes: {
    pluginId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  componentDidMount() {
    this.addSubscription(
      create(SnapshotConveyer, {pluginId: this.props.pluginId})
        .subscribe(data => this.setState({open: data.size === 0}))
    );
  },

  render() {
    if(!this.state.open) {
      return null;
    }

    return (
      <Dialog>
        <StanExplainsThings header={this.getIntlMessage('noNodesDialog.header')}>
          {this.getIntlMessage('noNodesDialog.content')}
        </StanExplainsThings>
      </Dialog>
    );
  }
});

export default NoNodesDialog;
