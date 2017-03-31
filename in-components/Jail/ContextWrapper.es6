import React from 'react';

const rpt = React.PropTypes;

const ContextWrapper = React.createClass({
  propTypes: {
    context: rpt.object.isRequired,
    component: rpt.any.isRequired,
    props: rpt.object
  },

  childContextTypes: {
    router: rpt.any
  },

  getChildContext() {
    return this.props.context;
  },

  render() {
    const Component = this.props.component;
    const props = this.props.props;
    return <Component {...props} />;
  }
});

export default ContextWrapper;
