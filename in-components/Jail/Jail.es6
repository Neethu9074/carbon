

import React from 'react/addons';
import {createLogger} from 'instalog';

import ContextWrapper from './ContextWrapper';

const logger = createLogger('in-component.Jail');

const rpt = React.PropTypes;

const Jail = React.createClass({
  propTypes: {
    component: rpt.any.isRequired,
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
        props,
        'Error:',
        e
      );
      React.render(
        <p>An unexpected error occured: {e.message}</p>,
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
    return (
      <div className='jail'></div>
    );
  }
});

export default Jail;
