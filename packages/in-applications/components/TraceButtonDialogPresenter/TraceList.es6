import React from 'react';

import Row from 'in-applications/components/TraceButtonDialogPresenter/Row';
import { getTracesCount } from 'in-applications/components/TracesButton';
import getApplication from 'in-subscription/application/getApplication';
import getEndpoint from 'in-subscription/application/getEndpoint';
import getService from 'in-subscription/application/getService';
import connectTo from 'in-hoc/connectTo';

import locals from './TraceList.mless';

export default connectTo(
  props => ({
    allTracesCount: getTracesCount({ timeConfig: props.timeConfig })
  }),
  function TraceButtonDialogPresenter({
    allTracesCount,
    timeConfig,
    applicationId,
    serviceId,
    endpointId,
    backButtonLabels
  }) {
    return (
      <section className={locals.traceList}>
        {allTracesCount && <Row label="All Traces" total={allTracesCount} value={allTracesCount} />}
        {applicationId && (
          <Row
            type="Application"
            iconType="app_application"
            getEntity={() =>
              getApplication({
                id: applicationId
              })
            }
            applicationId={applicationId}
            total={allTracesCount}
            timeConfig={timeConfig}
            backButtonLabels={backButtonLabels}
          />
        )}
        {serviceId && (
          <Row
            type="Service"
            iconType="app_service"
            getEntity={() =>
              getService({
                id: serviceId,
                filter: {
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId,
                  timeConfig
                }
              })
            }
            applicationId={applicationId}
            serviceId={serviceId}
            total={allTracesCount}
            timeConfig={timeConfig}
            backButtonLabels={backButtonLabels}
          />
        )}
        {endpointId && (
          <Row
            type="Endpoint"
            iconType="app_endpoint"
            getEntity={() =>
              getEndpoint({
                id: endpointId,
                filter: {
                  application: applicationId,
                  service: serviceId,
                  endpoint: endpointId,
                  timeConfig
                }
              })
            }
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            total={allTracesCount}
            timeConfig={timeConfig}
            backButtonLabels={backButtonLabels}
          />
        )}
      </section>
    );
  }
);
