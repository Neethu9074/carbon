/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default class TemporaryPresenter extends React.PureComponent {
  state = {
    showChildren: false,
    renderedForId: null
  };

  componentDidMount() {
    this.onPropChange(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.onPropChange(nextProps);
  }

  onPropChange(nextProps) {
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
  }

  hideChildren = () => {
    this.setState({
      showChildren: false
    });
    if (this.props.onHide) {
      this.props.onHide();
    }
  };

  componentWillUnmount() {
    this.stopTimeout();
  }

  stopTimeout = () => {
    clearTimeout(this.timeout);
  };

  render() {
    if (this.state.showChildren && this.props.children) {
      return this.props.children;
    }
    return null;
  }
}
