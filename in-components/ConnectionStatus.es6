import React from 'react';

import { on, off } from 'in-services/persistentConnection';
import Toast from 'in-components/Toast';

export default class extends React.Component {
  static displayName = 'ConnectionStatus';

  state = {
    systemMessage: null
  };

  componentDidMount() {
    on('connect', this.onConnect);
    on('connect_error', this.onConnectError);
    on('connect_timeout', this.onConnectTimeout);
    on('error', this.onConnectError);
    on('reconnect_error', this.onConnectError);
    on('disconnect', this.onConnectError);
    on('reconnect_failed', this.onConnectError);
  }

  componentWillUnmount() {
    off('connect', this.onConnect);
    off('connect_error', this.onConnectError);
    off('connect_timeout', this.onConnectTimeout);
    off('error', this.onConnectError);
    off('reconnect_error', this.onConnectError);
    off('disconnect', this.onConnectError);
    off('reconnect_failed', this.onConnectError);
  }

  onConnect = () => {
    this.setState({
      systemMessage: null
    });
  };

  onConnectTimeout = () => {
    this.setState({
      systemMessage: 'Connection timed out'
    });
  };

  onConnectError = () => {
    this.setState({
      systemMessage: 'Connection lost'
    });
  };

  render() {
    return (
      <Toast>
        {this.state.systemMessage}
      </Toast>
    );
  }
}
