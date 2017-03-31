import React from 'react';

import { on, off } from 'in-services/persistentConnection';
import Toast from 'in-components/Toast';

export default React.createClass({
  displayName: 'ConnectionStatus',

  getInitialState() {
    return {
      systemMessage: null
    };
  },

  componentDidMount() {
    on('connect', this.onConnect);
    on('connect_error', this.onConnectError);
  },

  componentWillUnmount() {
    off('connect', this.onConnect);
    off('connect_error', this.onConnectError);
  },

  onConnect() {
    this.setState({
      systemMessage: null
    });
  },

  onConnectError() {
    this.setState({
      systemMessage: 'Connection lost'
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
