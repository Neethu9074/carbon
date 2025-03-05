/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BizOpsUnifiedMetricConfiguration, TagFilterExpressionElementUnion } from '@instana/types';

// @ts-expect-error Need to translate module to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { getTagCatalog as getBizOpsTagCatalog } from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import useTopListResultData from 'in-custom-dashboards/widgets/TopList/useTopListResultData';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';

interface Config {
  metricConfiguration: BizOpsUnifiedMetricConfiguration;
}

interface CallTypeProps {
  tagFilterExpression: TagFilterExpressionElementUnion | undefined;
}

const BizOpsTopListCatalog = ({
  config,
  title,
  actions,
  dragHandle,
  timeConfig,
  filterResult
}: WidgetProps<Config>) => {
  const result = useTopListResultData(config, timeConfig) ?? pendingResult;

  const callTypeExpression: CallTypeProps = {
    tagFilterExpression: {
      elements: [
        {
          name: 'call.type',
          operator: 'EQUALS',
          value: 'BATCH',
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        },
        {
          name: 'call.type',
          operator: 'EQUALS',
          value: 'INTERNAL',
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        }
      ],
      logicalOperator: 'OR',
      type: 'EXPRESSION'
    }
  };

  config.metricConfiguration = { ...config.metricConfiguration, ...callTypeExpression };

  return (
    <ListWidgetRenderer
      title={title}
      result={result}
      dragHandle={dragHandle}
      tagCatalog={useTagCatalog(getBizOpsTagCatalog)}
      config={config}
      actions={actions}
      filterResult={filterResult}
    />
  );
};

export default BizOpsTopListCatalog;
