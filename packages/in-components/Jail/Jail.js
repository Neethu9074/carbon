import { createLogger } from '@instana/logger';
import rpt from 'prop-types';
import React from 'react';

import { ineum } from 'in-services/tracking/ineum';

import './Jail.less';

const logger = createLogger('in-component.Jail');
const block = 'in-jail';

class Jail extends React.Component {
  static propTypes = {
    component: rpt.any.isRequired,
    className: rpt.string,
    props: rpt.object
  };

  state = {
    error: null
  };

  UNSAFE_componentWillReceiveProps() {
    // TODO check for difference?
    this.setState({ error: null });
  }

  componentDidCatch(error, info) {
    ineum('reportError', error, {
      componentStack: info.componentStack
    });
    logger.error(
      'Failed to render component',
      this.props.component.displayName || this.props.component.name,
      'with props',
      // make a deep copy to ensure that all the properties are frozen in time and that
      // all immutable objects are made inspectable
      JSON.parse(JSON.stringify(this.props.props)),
      'Error:',
      error,
      'Info:',
      info
    );
    this.setState({
      error: { error, info }
    });
  }

  render() {
    const Component = this.props.component;
    const props = this.props.props || {};

    if (this.state.error) {
      return (
        <div className={this.props.className}>
          <div className={block + '__error'}>
            An unexpected error occured while rendering the{' '}
            <span className={block + '__error-component'}>{Component.displayName || Component.name}</span> component
            <p>Component properties:</p>
            <pre className={block + '__error-component-props'}>{JSON.stringify(props, 0, 2)}</pre>
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.className}>
        <Component {...props} />
      </div>
    );
  }
}

export default Jail;
