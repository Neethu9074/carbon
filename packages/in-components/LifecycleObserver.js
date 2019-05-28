import React from 'react';

export default class extends React.Component {
  static displayName = 'LifecycleObserver';

  UNSAFE_componentWillMount() {
    this.call('onWillMount');
  }

  componentDidMount() {
    this.call('onDidMount');
  }

  componentWillUnmount() {
    this.call('onWillUnmount');
  }

  UNSAFE_componentWillUpdate() {
    this.call('onWillUpdate');
  }

  call = fnName => {
    if (this.props[fnName]) {
      this.props[fnName]();
    }
  };

  render() {
    return null;
  }
}
