import React from 'react';

import { percentage } from 'in-services/formatters/number';

export default class Progress extends React.PureComponent {
  static defaultProps = {
    loadingStatePresentationDelayMillis: 500
  };

  state = {
    visible: false
  };

  componentDidMount() {
    this.reevaluateLoadingState();
  }

  reevaluateLoadingState() {
    const { progress, loadingStatePresentationDelayMillis } = this.props;

    if (!progress.loading) {
      this.disposeDelayedLoadingStatePresentation();
      this.setVisibility(false);
      return;
    }

    if (loadingStatePresentationDelayMillis < 1) {
      this.disposeDelayedLoadingStatePresentation();
      this.setVisibility(true);
      return;
    }

    if (this.loadingStateDelayPresentationHandle || this.state.visible) {
      return;
    }
    this.loadingStateDelayPresentationHandle = setTimeout(
      () => this.setVisibility(true),
      loadingStatePresentationDelayMillis
    );
  }

  setVisibility(visible) {
    this.setState({ visible });
  }

  componentDidUpdate() {
    this.reevaluateLoadingState();
  }

  componentWillUnmount() {
    this.disposeDelayedLoadingStatePresentation();
  }

  disposeDelayedLoadingStatePresentation() {
    clearTimeout(this.loadingStateDelayPresentationHandle);
    this.loadingStateDelayPresentationHandle = null;
  }

  render() {
    const { visible } = this.state;

    if (!visible) {
      return null;
    }

    const { progress } = this.props;

    return (
      <div>
        {progress.note || 'Loading…'} {progress.percentage != null && percentage.compact(progress.percentage)}
      </div>
    );
  }
}
