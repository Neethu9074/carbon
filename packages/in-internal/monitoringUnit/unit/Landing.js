/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ProcessingComponents from 'in-internal/monitoringUnit/unit/ProcessingComponents';
import SloViolationsChart from 'in-internal/components/SloViolationsChart';
import { canSeeExtendedInternalMonitoring } from 'in-stores/user';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Landing({ timeConfig, tenant, unit }) {
  return (
    <Fragment>
      {canSeeExtendedInternalMonitoring && (
        <Row>
          <Col lg={12}>
            <SloViolationsChart
              timeConfig={timeConfig}
              query={`entity.docker.label:"io.kubernetes.pod.name=${tenant}-${unit}-*"`}
              cardTitle={t('in-internal:monitoringUnit.unit.landing.sloViolations', {
                sloTenant: tenant,
                sloUnit: unit
              })}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col lg={12}>
          <ProcessingComponents timeConfig={timeConfig} tenant={tenant} unit={unit} />
        </Col>
      </Row>
    </Fragment>
  );
}
