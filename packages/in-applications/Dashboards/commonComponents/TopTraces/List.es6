import React from 'react';

import { number } from 'in-services/formatters/number';
import Row from 'in-new-components/TopListCard/Row';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const { result, selectedMetricFormatter } = props;
  return (
    <ol className={locals.topList}>
      {result.data.map((item, i) => (
        <Row
          key={i}
          metricValue={item.contributed}
          maxValue={item.total}
          label={`${item.endpoint.label} (${number.compact(item.traceCount)})`}
          renderedMetric={selectedMetricFormatter(item.total)}
          renderedContributedItem={
            <div className={locals.contributedService}>
              <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={16} height={16} />
              <span className={locals.serviceLabel}>service</span>
              <span>{selectedMetricFormatter(item.contributed)}</span>
            </div>
          }
          wrapLabel={label => <Tooltip content="Trace entry">{label}</Tooltip>}
          wrapContributedItem={item => <Tooltip content="Average time contributed to trace.">{item}</Tooltip>}
        />
      ))}
    </ol>
  );
}
