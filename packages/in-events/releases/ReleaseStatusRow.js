import React from 'react';

import ReleaseStatusRowPresenter from 'in-events/releases/ReleaseStatusRowPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      sortDirection: props.sortDirection$,
      sortBy: props.sortBy$
    };
  },
  ({ row, sortDirection, sortBy }) => {
    return sortBy === 'start' ? <ReleaseStatusRowPresenter {...row} sortDirection={sortDirection} /> : null;
  }
);
