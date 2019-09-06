import React from 'react';

import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(({ applicationId, timeConfig }) => ({
  application: getCloudfoundryApplication({
    filter: {
      applicationId,
      timeConfig
    }
  }).map(result => result.data)
}))(function AnalyzeTracesButton({ application }) {
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      disabled={!application}
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        filters: [
          { name: 'cf.app.id', value: application ? application.guid : '' },
          { name: 'cf.app.name', value: application ? application.label : '' }
        ],
        groupByTag: getConfigByDataSource('calls').defaultGrouping
      })}
    >
      Analyze Calls
    </Button>
  );
});
