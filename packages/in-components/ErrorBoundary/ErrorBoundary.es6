import { createLogger } from 'instalog';
import React from 'react';

import ErrorCounter from 'in-components/ErrorBoundary/ErrorCounter';
import { ineum } from 'in-services/eum';

const logger = createLogger('in-component.ErrorBoundary');

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentWillReceiveProps() {
    // try again
    this.setState({ error: false });
  }

  componentDidCatch(error, info) {
    ineum('reportError', error, {
      componentStack: info.componentStack
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
