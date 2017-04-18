import rpt from 'prop-types';
import React from 'react';

export default class extends React.Component {
  static displayName = 'TemporaryPresenter';

  static propTypes = {
    id: rpt.string.isRequired,
    duration: rpt.number,
    children: rpt.any
  };

  state = {
    showChildren: false,
    renderedForId: null
  };

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
  }

  hideChildren = () => {
    this.setState({
      showChildren: false
    });
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
