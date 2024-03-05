/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TagFilter } from '@instana/types';

//@ts-expect-error
import { toRenderModel } from 'in-components/QueryBuilder/transformation/renderModel';
//@ts-expect-error
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import { toUIGrouping } from 'in-alerting/smart-alerts/aggregated/utils/groupfilterExpression';
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/utils/groupingUtils';
import { CatalogResponse } from 'in-logging/api/catalog';
import { TagCatalog } from 'in-types';

import locals from 'in-alerting/smart-alerts/logs/components/LogGroupLabel.mless';

export function LogGroupLabel({ groupKey, tagCatalog }: { groupKey: string; tagCatalog?: CatalogResponse }) {
  if (!tagCatalog) {
    return <></>;
  }
  const groupingFE = toUIGrouping([groupKey]);

  const renderModel = toRenderModel(groupingFE).filter((model: TagFilter) => model.type === 'TAG_FILTER' && model.name);

  const groupByTagCatalog = getGroupByTagCatalog(tagCatalog as TagCatalog);
  return (
    <div className={locals.container}>
      <NameReadOnly
        tagCatalog={groupByTagCatalog}
        element={renderModel?.length > 0 ? renderModel[0] : undefined}
        rawStyle
      />
    </div>
  );
}
