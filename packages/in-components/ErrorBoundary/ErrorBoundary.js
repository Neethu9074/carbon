/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import React from 'react';

import ErrorCounter from 'in-components/ErrorBoundary/ErrorCounter';
import { ineum } from 'in-services/tracking/ineum';

const logger = createLogger('in-component.ErrorBoundary');

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  UNSAFE_componentWillReceiveProps() {
    // try again
    this.setState({ error: false });
  }

  componentDidCatch(error, info) {
    ineum('reportError', error, {
      componentStack: info.componentStack,
      meta: this.props.meta
    });

    const message = ['An unhandled error occurred within the React component tree'];
    if (this.props.name) {
      message.push(`which was caught at boundary ${this.props.name}.`);
    }
    message.push(error);
    message.push(info);

    logger.error.apply(logger, message);
    this.setState({ error: true });
  }

  render() {
    if (this.state.error) {
      return <ErrorCounter />;
    }

    return this.props.children;
  }
}
