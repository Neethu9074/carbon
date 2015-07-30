'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';
import Dialog from 'in-components/Dialog';

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
