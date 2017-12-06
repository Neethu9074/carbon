import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-components/breadcrumb/stores/breadcrumbs';

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat(props.items), []);
}

export default withSideEffect(reduceProps, replaceBreadcrumbs)(() => null);
