/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppMetricConfiguration } from '@instana/types';

// @ts-expect-error Need to translate module to TS
import { ListWidgetRenderer } from 'in-custom-dashboards/widgets/TopList/Widget';
// @ts-expect-error Need to translate module to TS
import useMobileAppTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import useTopListResultData from 'in-custom-dashboards/widgets/TopList/useTopListResultData';
import { WidgetProps } from 'in-custom-dashboards/widgets/types';
import { pendingResult } from 'in-services/fixedObjects';

interface Config {
  metricConfiguration: MobileAppMetricConfiguration;
}

const MobileTopListCatalog = ({
  config,
  title,
  actions,
  dragHandle,
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
      tagCatalog={useMobileAppTagCatalog(config.metricConfiguration.beaconType)}
      config={config}
      actions={actions}
      filterResult={filterResult}
    />
  );
};

export default MobileTopListCatalog;
