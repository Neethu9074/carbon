/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from 'in-i18n';

export default class extends React.Component {
  static displayName = t('in-components:delayed.displayNameDelayed');

  state = {
    renderChildren: false
  };

  componentDidMount() {
    this.timeoutHandle = setTimeout(() => {
      this.setState({ renderChildren: true });
    }, this.props.timeout || 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }

  render() {
    if (!this.state.renderChildren) {
      if (this.props.waitingComponent) {
        return <this.props.waitingComponent {...this.props} />;
      }
      return null;
    }
    return this.props.children;
  }
}
