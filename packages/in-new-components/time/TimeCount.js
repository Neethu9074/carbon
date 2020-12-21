import React, { Fragment } from 'react';

import { fromNowAccurately } from 'in-services/formatters/date';
import { interval } from '@instana/observables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ start }) => ({
  range: interval(1000)
    .startWith(start)
    .map(() => fromNowAccurately(start, 1000))
}))(function TimeCount({ range }) {
  return <Fragment>{range}</Fragment>;
});
