import { createLogger } from 'instalog';
import ReactDOM from 'react-dom';
import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/react';

import ContextWrapper from './ContextWrapper';

import './Jail.less';

const logger = createLogger('in-component.Jail');
const block = 'in-jail';

class Jail extends React.Component {
  static propTypes = {
    component: rpt.any.isRequired,
    className: rpt.string,
    props: rpt.object
  };

  static contextTypes = {
    router: rpt.any
  };

  state = {
    error: null
  };

  componentDidMount() {
    this.renderInprisonedComponent();
  }

  componentDidUpdate(prevProps) {
    if (this.props.component !== prevProps.component) {
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this));
    }
    this.renderInprisonedComponent();
  }

  renderInprisonedComponent = () => {
    const domNode = ReactDOM.findDOMNode(this);
    const Component = this.props.component;
    const props = this.props.props || {};

    try {
      ReactDOM.render(<ContextWrapper context={this.context} component={Component} props={props} />, domNode);
    } catch (e) {
      logger.error(
        'Failed to render component',
        Component.displayName,
        'with props',
        // make a deep copy to ensure that all the properties are frozen in time and that
        // all immutable objects are made inspectable
        JSON.parse(JSON.stringify(props)),
        'Error:',
        e
      );
      ReactDOM.render(
        <div className={block + '__error'}>
          An unexpected error occured while rendering the{' '}
          <span className={block + '__error-component'}>{Component.displayName}</span>:{' '}
          <span className={block + '__error-reason'}>{e.message}</span>
          <p>Component properties:</p>
          <pre className={block + '__error-component-props'}>
            {JSON.stringify(props, 0, 2)}
          </pre>
        </div>,
        domNode
      );
    }
  };

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this));
  }

  render() {
    return <div className={getClassName(this, block)} />;
  }
}

export default Jail;
