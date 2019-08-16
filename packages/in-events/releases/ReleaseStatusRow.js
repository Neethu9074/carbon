import React from 'react';

import ReleaseStatusRowPresenter from 'in-events/releases/ReleaseStatusRowPresenter';
import { sortDirection$ } from 'in-views/eventView/stores/sortDirection';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      sortDirection: sortDirection$,
      sortBy: props.sortBy$
    };
  },
  ({ row, sortDirection, sortBy }) => {
    return sortBy === 'start' ? <ReleaseStatusRowPresenter {...row} sortDirection={sortDirection} /> : null;
  }
);
