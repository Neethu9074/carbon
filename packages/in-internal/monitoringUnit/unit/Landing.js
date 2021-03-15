/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ProcessingComponents from 'in-internal/monitoringUnit/unit/ProcessingComponents';
import SloViolationsChart from 'in-internal/components/SloViolationsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import { isInstanaEmail } from 'in-stores/user';
import { t } from 'in-i18n';

export default function Landing({ timeConfig, tenant, unit }) {
  return (
    <Fragment>
      {isInstanaEmail && (
        <Row>
          <Col lg={12}>
            <SloViolationsChart
              timeConfig={timeConfig}
              query={`entity.label:"${tenant}-${unit}-*"`}
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
