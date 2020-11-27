import React from 'react';

import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import { analyzePath } from 'in-websites/navigation/paths';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { beaconType } from 'in-websites/navigation/matrix';

export default function WebsiteAnalyzeView() {
  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="pageLoad"
      dataSourceParameter={{
        path: analyzePath,
        name: beaconType
      }}
      getTagCatalog={getTagCatalog}
      groupedView={{
        defaultOrderBy: 'count',
        defaultOrderDirection: 'DESC'
      }}
      ungroupedView={{
        defaultOrderBy: 'timestamp',
        defaultOrderDirection: 'DESC'
      }}
    >
      {opts => {
        // eslint-disable-next-line
        console.log('WebsiteAnalyzeView:28 opts', opts);

        return <p>Hello World!</p>;
      }}
    </StateManagement>
  );
}
