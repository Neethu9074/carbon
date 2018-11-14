import { get } from 'lodash';
import React from 'react';

import Row from 'in-applications/components/CallsButtonDialog/Row';
import getMetrics from 'in-subscription/application/getMetrics';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './CallsButtonDialog.mless';

export default connectTo(
  ({ timeConfig }) => ({
    allCallsCount: getMetrics({
      filter: {
        timeConfig
      },
      metrics: {
        callCount: {
          metric: 'calls',
          aggregation: 'SUM'
        }
      }
    }).map(result => {
      if (!result || !result.data) {
        return null;
      }
      return get(result, ['data', 'callCount', '0', '1'], null);
    })
  }),
  function CallsButtonDialog({ allCallsCount, timeConfig, applicationId, serviceId, endpointId }) {
    return (
      <div className={locals.wrapper}>
        <div className={locals.header}>
          <SvgIcon className={locals.backgroundIcon} type="lib_application_trace" width={220} height={220} />
          <h2 className={locals.title}>Analyze Calls</h2>
          <p className={locals.text}>
            During the selected time window, this component has received calls in the following contexts.
          </p>
        </div>
        <section className={locals.traceList}>
          {allCallsCount && <Row label="Total Number of Calls" total={allCallsCount} value={allCallsCount} />}
          {applicationId && (
            <Row
              type="Application"
              iconType="lib_application"
              applicationId={applicationId}
              total={allCallsCount}
              timeConfig={timeConfig}
            />
          )}
          {serviceId && (
            <Row
              type="Service"
              iconType="lib_application_service"
              applicationId={applicationId}
              serviceId={serviceId}
              total={allCallsCount}
              timeConfig={timeConfig}
            />
          )}
          {endpointId && (
            <Row
              type="Endpoint"
              iconType="lib_application_endpoint"
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              total={allCallsCount}
              timeConfig={timeConfig}
            />
          )}
        </section>
      </div>
    );
  }
);
