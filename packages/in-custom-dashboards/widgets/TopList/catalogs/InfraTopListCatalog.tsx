/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraMetricConfiguration } from '@instana/types';

// @ts-expect-error Need to translate module to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import useTopListResultData from 'in-custom-dashboards/widgets/TopList/useTopListResultData';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';

interface Config {
  metricConfiguration: InfraMetricConfiguration;
}

const InfraTopListCatalog = ({
  config,
  title,
  actions,
  dragHandle,
  isInModal,
  timeConfig,
  filterResult
}: WidgetProps<Config>) => {
  const result = useTopListResultData(config, timeConfig) ?? pendingResult;
  const isErroneous =
    config.metricConfiguration.metric === 'erroneousCalls' || config.metricConfiguration.metric === 'errors';

  return (
    <ListWidgetRenderer
      title={title}
      result={result}
      dragHandle={dragHandle}
      isErroneous={isErroneous}
      tagCatalog={useTagCatalog(getTagCatalog)}
      config={config}
      isInModal={isInModal}
      actions={actions}
      timeConfig={timeConfig}
      filterResult={filterResult}
    />
  );
};

export default InfraTopListCatalog;
