import React from 'react';
import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-stores/breadcrumb';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

function reduceProps(propsList) {
  const breadcrumbs = [];
  propsList.forEach(function(props) {
    const { items } = props;

    breadcrumbs.push.apply(breadcrumbs, items);
  });
  return breadcrumbs;
}

function handleStateChange(breadcrumbs) {
  replaceBreadcrumbs(breadcrumbs);
}

export default withSideEffect(reduceProps, handleStateChange)(Breadcrumb);
