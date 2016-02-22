import React from 'react';

import * as connection from 'in-services/persistentConnection';
import Toast from 'in-components/Toast';

const ConnectionStatus = React.createClass({
  getInitialState() {
    return {
      systemMessage: null
    };
  },

  componentDidMount() {
    connection.on('connect', this.onConnect);
    connection.on('connect_error', this.onConnectError);
  },

  componentWillUnmount() {
    connection.off('connect', this.onConnect);
    connection.off('connect_error', this.onConnectError);
  },

  onConnect() {
    this.setState({
      systemMessage: null
    });
  },

  onConnectError() {
    this.setState({
      systemMessage: 'Connection lost.'
    });
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
