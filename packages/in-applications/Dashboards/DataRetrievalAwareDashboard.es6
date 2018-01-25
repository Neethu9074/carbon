import React from 'react';

import Dashboard from 'in-components/Dashboard_2_0/components/DashboardContent';
import Progress from 'in-components/Progress';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.get()
  }),
  function DataRetrievalAwareDashboard({ result, type }) {
    // TODO: depending on the result
    if (result.progress.loading) {
      return (
        <Progress
          progress={{
            loading: true,
            percentage: 0.5
          }}
        />
      );
    }
    return <Dashboard result={result.data} type={type} />;
  }
);
