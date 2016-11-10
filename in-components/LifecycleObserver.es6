import React from 'react';

export default React.createClass({
  displayName: 'LifecycleObserver',

  componentWillMount() {
    this.call('onWillMount');
  },

  componentDidMount() {
    this.call('onDidMount');
  },

  componentWillUnmount() {
    this.call('onWillUnmount');
  },

  call(fnName) {
    if (this.props[fnName]) {
      this.props[fnName]();
    }
  },

  render() {
    return null;
  }
});
