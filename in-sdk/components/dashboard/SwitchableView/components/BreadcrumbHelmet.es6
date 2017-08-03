import React from 'react';
import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-stores/breadcrumb';
import PluginIcon from 'in-components/PluginIcon';
import { getLabel } from 'in-sdk/snapshot';

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
    const { context } = props;

    contexts.push({
      ...context,
      label: context.snapshot ? getLabel(context.snapshot) : context.label,
      icon: context.snapshot ? <PluginIcon dimension={14} color="#fff" snapshot={context.snapshot} /> : null
    });
  });
  return contexts;
}

function handleStateChange(contexts) {
  replaceBreadcrumbs(contexts);
}

export default withSideEffect(reduceProps, handleStateChange)(BreadcrumbHelmet);
