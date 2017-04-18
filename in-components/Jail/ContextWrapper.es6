import rpt from 'prop-types';
import React from 'react';

class ContextWrapper extends React.Component {
  static propTypes = {
    context: rpt.object.isRequired,
    component: rpt.any.isRequired,
    props: rpt.object
  };

  static childContextTypes = {
    router: rpt.any
  };

  getChildContext() {
    return this.props.context;
  }

  render() {
    const Component = this.props.component;
    const props = this.props.props;
    return <Component {...props} />;
  }
}

export default ContextWrapper;
