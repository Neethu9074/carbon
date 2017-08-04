import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-stores/breadcrumb';

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

export default withSideEffect(reduceProps, handleStateChange)(() => null);
