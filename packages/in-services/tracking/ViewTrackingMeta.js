/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import withSideEffect from 'react-side-effect';

import { setMeta } from 'in-services/tracking/tracking';

function reduceProps(propsList) {
  return propsList.reduce(
    (result, props) => ({
      ...result,
      ...props.data
    }),
    {}
  );
}

export default withSideEffect(reduceProps, setMeta)(() => null);
