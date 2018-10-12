import { get } from 'lodash';
import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { trackTopListNavigation } from 'in-new-components/TopList';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { number } from 'in-services/formatters/number';
import Row from 'in-new-components/TopListCard/Row';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const { result, selectedMetricFormatter } = props;

  return (
    <ol className={locals.topList}>
      {result.data.map((item, i) => {
        const renderProps = {
          ...props,
          item
        };

        return (
          <Row
            key={i}
            metricValue={item.contributed}
            maxValue={item.total}
            label={renderLabel(renderProps, item, locals.label)}
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
        );
      })}
    </ol>
  );
}

function renderLabel(props) {
  return <Label {...props} />;
}

const Label = connectTo(
  props => ({
    service: getServiceLabel({
      id: props.serviceId
    }),
    application: getApplication({
      id: props.applicationId
    })
  }),
  function Label({ item, application, service }) {
    return (
      <Link
        href$={getLinkToAnalyze({
          applicationName: get(application, ['data', 'label']),
          serviceName: get(service, ['data', 'label']),
          dataSource: 'traces',
          groupByTag: {},
          filters: [{ name: 'trace.name', value: item.endpoint.label }]
        })}
        onClick={() => trackTopListNavigation()}
      >
        {`${item.endpoint.label} (${number.compact(item.traceCount)})`}
      </Link>
    );
  }
);
