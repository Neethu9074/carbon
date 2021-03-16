/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import withSideEffect from 'react-side-effect';

import { replaceBreadcrumbs } from 'in-components/breadcrumb/stores/breadcrumbs';

function reduceProps(propsList) {
  return propsList.reduce(
    (result, props) =>
      result
        .concat(props.items)
        // allow false/null as items for ease of use
        .filter(v => !!v),
    []
  );
}

export default withSideEffect(reduceProps, replaceBreadcrumbs)(() => null);
