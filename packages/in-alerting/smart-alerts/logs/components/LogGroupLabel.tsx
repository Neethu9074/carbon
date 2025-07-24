/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Group, TagFilter, TagCatalog } from '@instana/types';

//@ts-expect-error
import { toRenderModel } from 'in-components/QueryBuilder/transformation/renderModel';
//@ts-expect-error
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import { toUIGrouping } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/utils/groupingUtils';
import { CatalogResponse } from 'in-logging/api/catalog';

import locals from 'in-alerting/smart-alerts/logs/components/LogGroupLabel.mless';

export function LogGroupLabel({ groups, tagCatalog }: { groups: Group[]; tagCatalog?: CatalogResponse }) {
  if (!tagCatalog) {
    return <></>;
  }
  const groupingFE = toUIGrouping(groups);

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
