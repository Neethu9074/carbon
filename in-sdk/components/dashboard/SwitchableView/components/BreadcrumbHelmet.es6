import React from 'react';
import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-stores/breadcrumb';

class BreadcrumbHelmet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

function reduceProps(propsList) {
  const contexts = [];
  propsList.forEach(function(props) {
    contexts.push(props.context);
  });
  return contexts;
}

function handleStateChange(contexts) {
  replaceBreadcrumbs(contexts);
}

export default withSideEffect(reduceProps, handleStateChange)(BreadcrumbHelmet);
