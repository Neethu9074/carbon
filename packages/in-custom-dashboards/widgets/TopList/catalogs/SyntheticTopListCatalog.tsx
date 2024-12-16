/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticMetricConfiguration } from '@instana/types';

// @ts-expect-error Need to translate module to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { getTagCatalog as getSyntheticCatalog } from 'in-synthetics/utils/syntheticsQueryBuilder';
import useTopListResultData from 'in-custom-dashboards/widgets/TopList/useTopListResultData';
import useSynMonTagCatalog from 'in-synthetics/hooks/useTagCatalog';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { pendingResult } from 'in-services/fixedObjects';

interface Config {
  metricConfiguration: SyntheticMetricConfiguration;
}

const SyntheticTopListCatalog = ({
  config,
  title,
  actions,
  dragHandle,
  timeConfig,
  filterResult
}: WidgetProps<Config>) => {
  const result = useTopListResultData(config, timeConfig) ?? pendingResult;

  return (
    <ListWidgetRenderer
      title={title}
      result={result}
      dragHandle={dragHandle}
      tagCatalog={useSynMonTagCatalog(getSyntheticCatalog)}
      config={config}
      actions={actions}
      filterResult={filterResult}
    />
  );
};

export default SyntheticTopListCatalog;
