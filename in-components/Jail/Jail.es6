import React from 'react/addons';
import {createLogger} from 'instalog';

import {getClassName} from 'in-services/react';

import ContextWrapper from './ContextWrapper';

import './Jail.less';

const logger = createLogger('in-component.Jail');
const rpt = React.PropTypes;
const block = 'in-jail';

const Jail = React.createClass({
  propTypes: {
    component: rpt.any.isRequired,
    className: rpt.string,
    props: rpt.object
  },

  // Context types required by react-router and react-intl
  contextTypes: {
    router: rpt.any,
    locales: rpt.any,
    formats: rpt.any,
    messages: rpt.any
  },

  getInitialState() {
    return {
      error: null
    };
  },

  componentDidMount() {
    this.renderInprisonedComponent();
  },

  componentDidUpdate(prevProps) {
    if (this.props.component !== prevProps.component) {
      React.unmountComponentAtNode(
        React.findDOMNode(this)
      );
    }
    this.renderInprisonedComponent();
  },

  renderInprisonedComponent() {
    const domNode = React.findDOMNode(this);
    const Component = this.props.component;
    const props = this.props.props || {};

    try {
      React.render(
        <ContextWrapper context={this.context}
                        component={Component}
                        props={props} />,
        domNode
      );
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
      React.render(
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
  },

  componentWillUnmount() {
    React.unmountComponentAtNode(
      React.findDOMNode(this)
    );
  },

  render() {
    return <div className={getClassName(this, block)} />;
  }
});

export default Jail;
