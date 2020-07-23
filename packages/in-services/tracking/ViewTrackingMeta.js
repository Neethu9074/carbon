import withSideEffect from 'react-side-effect';

import { setMeta } from 'in-services/tracking/viewTracking';

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
