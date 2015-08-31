

import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as connection from 'in-services/connection';
import Toast from 'in-components/Toast';

const ConnectionStatus = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      systemMessage: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      connection.emitter.on('closed').subscribe(() =>
        this.setState({
          systemMessage: 'Connection lost.'
        })
      )
    );

    this.addSubscription(
      connection.emitter.on('connected').subscribe(() =>
        this.setState({
          systemMessage: null
        })
      )
    );
  },

  render() {
    return (
      <Toast>
        {this.state.systemMessage}
      </Toast>
    );
  }
});

export default ConnectionStatus;
