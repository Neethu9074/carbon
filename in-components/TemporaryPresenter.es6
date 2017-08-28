import rpt from 'prop-types';
import React from 'react';

export default class TemporaryPresenter extends React.PureComponent {
  static propTypes = {
    id: rpt.string.isRequired,
    duration: rpt.number,
    children: rpt.any
  };

  state = {
    showChildren: false,
    renderedForId: null
  };

  componentDidMount() {
    this.onPropChange(this.props);
  }

  componentWillReceiveProps(nextProps) {
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
  };

  componentWillUnmount() {
    this.stopTimeout();
  }

  stopTimeout = () => {
    clearTimeout(this.timeout);
  };

  render() {
    if (this.state.showChildren && this.props.children) {
      // TODO remove with React 16 since React fiber should be able to render arrays
      if (React.Children.count(this.props.children) > 1) {
        return <div>{this.props.children}</div>;
      }
      return this.props.children;
    }
    return null;
  }
}
