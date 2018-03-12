import React from 'react';

import Row from 'in-applications/components/TraceButtonDialogPresenter/Row';
import { getTracesCount } from 'in-applications/components/TracesButton';
import getApplication from 'in-subscription/application/getApplication';
import getEndpoint from 'in-subscription/application/getEndpoint';
import getService from 'in-subscription/application/getService';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { analyzeEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './TraceList.mless';

export default connectTo(
  props => ({
    allTracesCount: getTracesCount({ timeframe: props.timeframe })
  }),
  function TraceButtonDialogPresenter({ allTracesCount, timeframe, applicationId, serviceId, endpointId }) {
    return (
      <section className={locals.traceList}>
        {allTracesCount && <Row label="All Traces" total={allTracesCount} value={allTracesCount} />}
        <Row
          type="Application"
          iconType="app_application"
          entityId={applicationId}
          getEntity={getApplication}
          applicationId={applicationId}
          total={allTracesCount}
          timeframe={timeframe}
        />
        <Row
          type="Service"
          iconType="app_service"
          entityId={serviceId}
          getEntity={getService}
          applicationId={applicationId}
          serviceId={serviceId}
          total={allTracesCount}
          timeframe={timeframe}
        />
        <Row
          type="Endpoint"
          iconType="app_endpoint"
          entityId={endpointId}
          getEntity={getEndpoint}
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          total={allTracesCount}
          timeframe={timeframe}
        />

        {analyzeEnabled && (
          <div className={locals.cta}>
            <Button kind="primary" size="normal" href$={getLinkToAnalyze({ applicationId, serviceId, endpointId })}>
              Analyze
            </Button>
          </div>
        )}
      </section>
    );
  }
);
