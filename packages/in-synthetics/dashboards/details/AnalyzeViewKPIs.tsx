/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDateTime } from '@instana/format-date';
import { t } from '@instana/i18n-react';

import { getResponseSize, getStatusKPICard, getTestTypeRequestsCount } from 'in-synthetics/dashboards/details/utils';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import isBrowserTestType from 'in-synthetics/utils/isBrowserTestType';
import { ResultDetailsResponse } from 'in-synthetics/utils/constants';
import { bytes, meanLatency } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';

interface AnalyzeViewKPIProps {
  startTime: number;
  status: number;
  responseTime: number;
  responseSize: string | null | undefined;
  testType: string;
  timelineDetails: ResultDetailsResponse;
  resultList: Result<PaginatedResult<TestResultListItem>>;
}

export default function AnalyzeViewKPIs({
  startTime,
  status,
  responseTime,
  responseSize,
  testType,
  timelineDetails,
  resultList
}: AnalyzeViewKPIProps) {
  const location = useLocation();
  const isBrowserTest: boolean = isBrowserTestType(testType);
  const analyzeViewCommonKPIs = [
    {
      id: 'startTime',
      component: (
        <Col xs key="startTime">
          <KpiCard
            title={t('in-synthetics:dashboard.summary.startTime')}
            value={startTime}
            renderValue={formatDateTime}
          />
        </Col>
      )
    },
    {
      id: 'status',
      component: (
        <Col xs key="status">
          {getStatusKPICard(status)}
        </Col>
      )
    },
    {
      id: 'responseTime',
      component: (
        <Col xs key="responseTime">
          <KpiCard
            title={t('in-synthetics:dashboard.summary.responseTime')}
            value={responseTime}
            renderValue={meanLatency.detailed}
          />
        </Col>
      )
    },
    {
      id: 'requests',
      component: (
        <Col
          xs
          key="requests"
          style={{
            display: get(timelineDetails, ['errors', 0, 'code'], '') === 'NOT_FOUND' ? 'none' : 'block'
          }}
        >
          <KpiCard
            title={t('in-synthetics:dashboard.summary.requests')}
            value={getTestTypeRequestsCount(isBrowserTest, timelineDetails)}
          />
        </Col>
      )
    },
    {
      id: 'responseSize',
      component: (
        <Col xs key="responseSize">
          <KpiCard
            title={t('in-synthetics:dashboard.summary.responseSize')}
            value={getResponseSize(responseSize, location, resultList.data?.items[0])}
            renderValue={bytes.detailed}
          />
        </Col>
      )
    }
  ];

  const isCertificateValidKPI = (
    <Col xs key="isCertificateValid">
      <KpiCard
        title={t('in-synthetics:dashboard.summary.resultsCertificateValid')}
        value={
          !get(resultList.data?.items[0], ['metrics', 'synthetic.customMetrics.validTo', 0, 1])
            ? valueMissingPlaceholder
            : get(resultList.data?.items[0], ['metrics', 'synthetic.customMetrics.valid', 0, 1]) === 1
            ? t('in-synthetics:dashboard.summary.certificateValid')
            : t('in-synthetics:dashboard.summary.certificateNotValid')
        }
      />
    </Col>
  );

  /**
   * Construct the array containing the SSL KPIs for Analyze view
   * @returns {JSX.Element[]} Array of Start Time, Status, Response Time and Certificate is Signed by Public CA KPIs
   */
  const getKPIsForSsl = () => {
    // Remove Requests and Response Size KPIs for SSL
    const kPIsForSslObj = analyzeViewCommonKPIs.filter(
      component => component.id !== 'requests' && component.id !== 'responseSize'
    );
    const kPIsForSsl: JSX.Element[] = [];
    kPIsForSslObj.map((kpi: any) => {
      kPIsForSsl.push(kpi.component);
    });
    kPIsForSsl.push(isCertificateValidKPI);
    return kPIsForSsl;
  };

  /**
   * Construct the array containing the DNSAction KPIs for Analyze view
   * @returns {JSX.Element[]} Array of Start Time, Status, and Response Time
   */
  const getKPIsForDNSAction = () => {
    // Remove Requests and Response Size KPIs for DNSAction
    const kPIsForDnsActionObj = analyzeViewCommonKPIs.filter(
      component => component.id !== 'requests' && component.id !== 'responseSize'
    );
    const kPIsForDnsAction: JSX.Element[] = [];
    kPIsForDnsActionObj.map((kpi: any) => {
      kPIsForDnsAction.push(kpi.component);
    });
    return kPIsForDnsAction;
  };

  /**
   * Construct the array containing the KPIs for Analyze view
   * @returns {JSX.Element[]} Array of Start Time, Status, Response Time, Requests and Response Size KPIs
   */
  const getKPIsForOthers = () => {
    const kPIsForOthers: JSX.Element[] = [];
    analyzeViewCommonKPIs.map((kpi: any) => {
      kPIsForOthers.push(kpi.component);
    });
    return kPIsForOthers;
  };

  return (
    <Row>
      {testType === 'SSLCertificate'
        ? getKPIsForSsl()
        : testType === 'DNSAction'
        ? getKPIsForDNSAction()
        : getKPIsForOthers()}
    </Row>
  );
}
