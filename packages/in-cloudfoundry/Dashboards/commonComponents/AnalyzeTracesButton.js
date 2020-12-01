import React from 'react';

import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
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
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      disabled={!application}
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          dataSource: 'calls',
          filters: [
            { name: 'cloudfoundry.application.id', value: application ? application.guid : '' },
            { name: 'cloudfoundry.application.name', value: application ? application.label : '' }
          ],
          tagCatalog,
          groupByTag: getConfigByDataSource('calls').defaultGrouping
        })
      }
    >
      Analyze Calls
    </Button>
  );
});
