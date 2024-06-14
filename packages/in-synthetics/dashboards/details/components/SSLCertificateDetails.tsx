/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDateTime } from '@instana/format-date';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { Col, Row } from 'in-components/layout/Grid/Grid';

//import locals from 'in-synthetics/dashboards/details/components/FailedRun.mless';

interface Props {
  resultList: Result<PaginatedResult<TestResultListItem>>;
}

const SSLCertificateDetails = ({ resultList }: Props) => {
  const resultListItem = resultList.data?.items[0];
  return (
    <Card title="Details">
      <Row>
        <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.daysRemaining')}</Col>
        <Col xs={3}>{get(resultListItem, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1], 0)}</Col>
      </Row>
      <Row>
        <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.timeOfIssue')}</Col>
        <Col xs={3}>
          {formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validFrom', 0, 1], 0))}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>{t('in-synthetics:dashboard.detailsPage.sslCertificate.timeOfExpiry')}</Col>
        <Col xs={3}>{formatDateTime(get(resultListItem, ['metrics', 'synthetic.customMetrics.validTo', 0, 1], 0))}</Col>
      </Row>
    </Card>
  );
};

export default SSLCertificateDetails;
