import React from 'react';

import Row from 'in-applications/components/TraceButtonDialogPresenter/Row';
import { getTracesCount } from 'in-applications/components/TracesButton';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './TraceList.mless';

export default connectTo(
  props => ({
    allTracesCount: getTracesCount({ timeConfig: props.timeConfig })
  }),
  function TraceButtonDialogPresenter({ allTracesCount, timeConfig, applicationId, serviceId, endpointId }) {
    return (
      <div className={locals.wrapper}>
        <div className={locals.header}>
          <SvgIcon className={locals.backgroundIcon} type="lib_application_trace" width={220} height={220} />
          <h2 className={locals.title}>Analyze Traces</h2>
          <p className={locals.text}>
            During the selected time window, the following traces have touched this component. Each trace may have
            resulted in more than one call to this component.
          </p>
        </div>
        <section className={locals.traceList}>
          {allTracesCount && <Row label="All Traces" total={allTracesCount} value={allTracesCount} />}
          {applicationId && (
            <Row
              type="Application"
              iconType="lib_application"
              applicationId={applicationId}
              total={allTracesCount}
              timeConfig={timeConfig}
            />
          )}
          {serviceId && (
            <Row
              type="Service"
              iconType="lib_application_service"
              applicationId={applicationId}
              serviceId={serviceId}
              total={allTracesCount}
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
              total={allTracesCount}
              timeConfig={timeConfig}
            />
          )}
        </section>
      </div>
    );
  }
);
