/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getGroupByHostnameConfig,
  getGroupByHttpHostConfig,
  getGroupByProcessUptime,
  getGroupByServiceRuleId,
  getGroupBySpanType,
  getInfraLinkingMetricConfig,
  getInfraReferenceTypeMetricConfig,
  getServiceMappingMetricConfig,
  groupByHostname,
  groupByHttpHost,
  groupByInfraLinkingOutcome,
  groupByInfraReferenceType,
  groupByProcessUptime,
  groupByServiceMappingOutcome,
  groupByServiceRuleId,
  groupBySpanType
} from './metricConfigs';
import GroupBigNumberKpiCard, { groupedBigNumberKpiMapper } from './GroupedBigNumberKpiCard';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { syntheticCallsOptions } from 'in-applications/constants';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import TroubleShootingChart from './TroubleShootingChart';
import { Col, Row } from 'in-components/layout/Grid';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface TroubleShootingProps {
  timeConfig: TimeConfig;
  serviceId: string;
  syntheticCalls: string;
  boundaryScope: string;
}

export default function Troubleshooting(props: TroubleShootingProps) {
  const timeShiftConfig = useTimeShiftConfig();
  const { timeConfig, serviceId, syntheticCalls: urlSyntheticCalls, boundaryScope } = props;
  const syntheticCalls = urlSyntheticCalls || syntheticCallsOptions.default;

  return (
    <>
      <Row>
        <Col lg>
          <GroupBigNumberKpiCard
            title={t('in-applications:serviceTroubleshooting.numberOfHosts')}
            resultMapper={groupedBigNumberKpiMapper}
            timeConfig={timeConfig}
            timeShiftConfig={timeShiftConfig}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            serviceId={serviceId}
            groupByTag={'host.name'}
            groupByTagEntity={DESTINATION}
          />
        </Col>
        <Col lg>
          <GroupBigNumberKpiCard
            title={t('in-applications:serviceTroubleshooting.numberOfHostnames')}
            resultMapper={groupedBigNumberKpiMapper}
            timeConfig={timeConfig}
            timeShiftConfig={timeShiftConfig}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            serviceId={serviceId}
            groupByTag={'call.http.host'}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.serviceMapping')}
            explanation={t('in-applications:serviceTroubleshooting.serviceMappingExplanation')}
            serviceId={serviceId}
            metricConfig={getServiceMappingMetricConfig(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceMappingOutcome}
          />
        </Col>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraLinking')}
            explanation={t('in-applications:serviceTroubleshooting.infraLinkingExplanation')}
            serviceId={serviceId}
            metricConfig={getInfraLinkingMetricConfig(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByInfraLinkingOutcome}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.hostNameErrors')}
            explanation={t('in-applications:serviceTroubleshooting.hostNameErrorsExplanation')}
            serviceId={serviceId}
            metricConfig={getGroupByHostnameConfig(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByHostname}
          />
        </Col>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.httpHostErrors')}
            explanation={t('in-applications:serviceTroubleshooting.httpHostErrorsExplanation')}
            serviceId={serviceId}
            metricConfig={getGroupByHttpHostConfig(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByHttpHost}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.spanTypeErrors')}
            explanation={t('in-applications:serviceTroubleshooting.spanTypeErrorsExplanation')}
            serviceId={serviceId}
            metricConfig={getGroupBySpanType(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupBySpanType}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.processUptime')}
            explanation={t('in-applications:serviceTroubleshooting.processUptimeExplanation')}
            serviceId={serviceId}
            metricConfig={getGroupByProcessUptime(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByProcessUptime}
          />
        </Col>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraReferenceType')}
            explanation={t('in-applications:serviceTroubleshooting.infraReferenceTypeExplanation')}
            serviceId={serviceId}
            metricConfig={getInfraReferenceTypeMetricConfig(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByInfraReferenceType}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.serviceRuleId')}
            explanation={t('in-applications:serviceTroubleshooting.serviceRuleIdExplanation')}
            serviceId={serviceId}
            metricConfig={getGroupByServiceRuleId(serviceId)}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceRuleId}
          />
        </Col>
      </Row>
    </>
  );
}
