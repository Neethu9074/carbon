/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TagFilter, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDate } from '@instana/format-date';

import { bytes, meanLatency, number, percentage } from 'in-services/formatters/number';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { TimeShift } from 'in-components/Chart/types';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface SummaryKPIProps {
  tagFilters: TagFilter[];
  timeShiftConfig: TimeShift;
  isSSLCertificate: boolean;
  resultList: Result<PaginatedResult<TestResultListItem>>;
}

export default function SummaryKPIs({ tagFilters, timeShiftConfig, isSSLCertificate, resultList }: SummaryKPIProps) {
  const SummaryKPIs = [
    {
      id: 'successRate',
      component: (
        <Col xs key="successRate">
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.successRate')}
            formatter={percentage.detailed}
            companionFormatter={v =>
              t('in-synthetics:dashboard.summary.totalRuns', {
                totalRuns: number.compact(v)
              })
            }
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'status',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'id',
                source: 'SYNTHETICS',
                // @ts-expect-error
                tagFilters: tagFilters
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      )
    },
    {
      id: 'locations',
      component: (
        <Col xs key="locations">
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.locations')}
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'location_id',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      )
    },
    {
      id: 'meanResponseTime',
      component: (
        <Col xs key="meanResponseTime">
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.meanResponseTime')}
            formatter={meanLatency.detailed}
            companionFormatter={v =>
              t('in-synthetics:dashboard.summary.meanLatencyFor90th', {
                meanLatencyDetail: meanLatency.detailed(v)
              })
            }
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'response_time',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'P90',
                metric: 'response_time',
                source: 'SYNTHETICS',
                // @ts-expect-error
                tagFilters: tagFilters
              },
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      )
    },
    {
      id: 'avgResponseSize',
      component: (
        <Col xs key="avgResponseSize">
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.avgResponseSize')}
            formatter={bytes.detailed}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'response_size',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      )
    }
  ];

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Last Run - Certificate is Valid, Last Run - Days Remaining and Last Run - Date of Expiry charts
   */
  const getSSLCertificateKPICards = () => {
    const resultListItem = resultList.data?.items[0];
    const daysRemaining = get(resultListItem, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1]);
    const expDate = get(resultListItem, ['metrics', 'synthetic.customMetrics.validTo', 0, 1]);
    const getIsCertificateValidValue = () => {
      if (get(resultListItem, ['metrics', 'synthetic.customMetrics.valid', 0, 1]) === 1)
        return t('in-synthetics:dashboard.summary.certificateValid');
      else return t('in-synthetics:dashboard.summary.certificateNotValid');
    };

    return [
      <Col xs key="isCertificateValid">
        <KpiCard
          title={t('in-synthetics:dashboard.summary.isCertificateValid')}
          value={expDate ? getIsCertificateValidValue() : valueMissingPlaceholder}
        />
      </Col>,
      <Col xs key="daysRemaining">
        <KpiCard
          title={t('in-synthetics:dashboard.summary.daysRemaining')}
          value={expDate ? daysRemaining : valueMissingPlaceholder}
        />
      </Col>,
      <Col xs key="dateOfExpiry">
        <KpiCard
          title={t('in-synthetics:dashboard.summary.dateOfExpiry')}
          value={expDate ?? valueMissingPlaceholder}
          renderValue={expDate ? formatDate : undefined}
        />
      </Col>
    ];
  };

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Success Rate, Locations and Avg. Response Time charts
   */
  const getCommonKPIsForSsl = () => {
    const commonKPIsForSslObj = SummaryKPIs.filter(component => component.id !== 'avgResponseSize');
    const commonKPIsForSsl: JSX.Element[] = [];
    commonKPIsForSslObj.map((kpi: any) => {
      commonKPIsForSsl.push(kpi.component);
    });
    return commonKPIsForSsl;
  };

  /**
   * Construct the array containing the common charts for Summary view
   * @returns {JSX.Element[]} Array of Success Rate, Locations, Avg. Response Time and Avg. Response Size charts
   */
  const getCommonKPIsForOthers = () => {
    const commonKPIsForOthers: JSX.Element[] = [];
    SummaryKPIs.map((kpi: { component: JSX.Element }) => {
      commonKPIsForOthers.push(kpi.component);
    });
    return commonKPIsForOthers;
  };

  if (isSSLCertificate) {
    return (
      <>
        <Row>{getCommonKPIsForSsl()}</Row>
        <Row>{getSSLCertificateKPICards()}</Row>
      </>
    );
  } else {
    return <Row>{getCommonKPIsForOthers()}</Row>;
  }
}
