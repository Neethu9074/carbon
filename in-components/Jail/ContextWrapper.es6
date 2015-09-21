import React from 'react/addons';

const rpt = React.PropTypes;

const ContextWrapper = React.createClass({

  // Context types required by react-router and react-intl
  propTypes: {
    context: rpt.object.isRequired,
    component: rpt.any.isRequired,
    props: rpt.object
  },

  childContextTypes: {
    router: rpt.any,
    locales: rpt.any,
    formats: rpt.any,
    messages: rpt.any
  },

  getChildContext() {
    return this.props.context;
  },

  render() {
    const Component = this.props.component;
    const props = this.props.props;
    return (
      <Component {...props} />
    );
  }
});

export default ContextWrapper;
