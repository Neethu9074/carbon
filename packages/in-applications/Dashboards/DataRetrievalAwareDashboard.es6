import React from 'react';

import Progress from 'in-components/Progress';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.get()
  }),
  function DataRetrievalAwareDashboard({ result, render }) {
    const isLoading = result.progress.loading;
    const hasErrors = result.errors.length > 0;

    if (isLoading) {
      return <Progress progress={result.progress} />;
    } else if (hasErrors) {
      return 'Errors';
    }
    return render({ data: result.data });
  }
);
