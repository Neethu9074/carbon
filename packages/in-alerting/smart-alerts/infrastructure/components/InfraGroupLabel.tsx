/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TagCatalog, TagFilter } from '@instana/types';

//@ts-expect-error
import { toRenderModel } from 'in-components/QueryBuilder/transformation/renderModel';
//@ts-expect-error
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import { useGroupByCatalog } from 'in-alerting/smart-alerts/infrastructure/hooks/useGroupByLabel';
import { getGroupingFE } from 'in-alerting/smart-alerts/infrastructure/details/AlertGrouping';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel.mless';

export function GroupLabel({ groupKey, tagCatalog }: { groupKey: string; tagCatalog: TagCatalog }) {
  const groupingFE = getGroupingFE([groupKey]);

  const renderModel = toRenderModel(groupingFE).filter((model: TagFilter) => model.type === 'TAG_FILTER' && model.name);

  const groupByTagCatalog = useGroupByCatalog(tagCatalog);

  return (
    <div className={locals.container}>
      <NameReadOnly
        tagCatalog={groupByTagCatalog}
        element={renderModel?.length > 0 ? renderModel[0] : undefined}
        isBold={false}
      />
    </div>
  );
}
