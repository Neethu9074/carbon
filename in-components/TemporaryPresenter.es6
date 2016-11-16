import React from 'react';

export default React.createClass({
  displayName: 'TemporaryPresenter',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    duration: React.PropTypes.number,
    children: React.PropTypes.any
  },

  getInitialState() {
    return {
      showChildren: false,
      renderedForId: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.renderedForId === nextProps.id) {
      // nothing to do
      return;
    }

    this.stopTimeout();
    this.setState({
      showChildren: true,
      renderedForId: nextProps.id
    });

    if (nextProps.duration) {
      this.timeout = setTimeout(this.hideChildren, nextProps.duration);
    }
  },

  hideChildren() {
    this.setState({
      showChildren: false
    });
  },

  componentWillUnmount() {
    this.stopTimeout();
  },

  stopTimeout() {
    clearTimeout(this.timeout);
  },

  render() {
    if (this.state.showChildren && this.props.children) {
      return this.props.children;
    }
    return null;
  }
});
