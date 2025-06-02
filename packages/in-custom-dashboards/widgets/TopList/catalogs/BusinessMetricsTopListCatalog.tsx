/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BizOpsUnifiedMetricConfiguration } from '@instana/types';

// @ts-expect-error Need to translate module to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import useTopListResultData from 'in-custom-dashboards/widgets/TopList/useTopListResultData';
import useBusinessMetricsTagCatalog from 'in-bizops/utils/useBusinessMetricsTagCatalog';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { pendingResult } from 'in-services/fixedObjects';

interface Config {
  metricConfiguration: BizOpsUnifiedMetricConfiguration;
}

const BusinessMetricsTopListCatalog = ({
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
      tagCatalog={useBusinessMetricsTagCatalog({ metric: config.metricConfiguration.metric })}
      config={config}
      actions={actions}
      filterResult={filterResult}
    />
  );
};

export default BusinessMetricsTopListCatalog;
