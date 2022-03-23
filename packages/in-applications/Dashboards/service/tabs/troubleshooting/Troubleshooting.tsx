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
  groupBySpanType,
  infraLinkingColorMapper,
  infraReferenceColorMapper,
  qualifiedReferencesFilter,
  serviceMappingColorMapper
} from './metricConfigs';
import GroupBigNumberKpiCard, { groupedBigNumberKpiMapper } from './GroupedBigNumberKpiCard';
import AlternativeServicesChart from './AlternativeServicesChart/AlternativeServicesChart';
// @ts-expect-error
import Renderer from 'in-components/Chart/renderer/Renderer';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { syntheticCallsOptions } from 'in-applications/constants';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import TroubleShootingChart from './TroubleShootingChart';
import { number } from 'in-services/formatters/number';
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
        <Col xs>
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
        <Col xs>
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
        <Col xs>
          <GroupBigNumberKpiCard
            title={t('in-applications:serviceTroubleshooting.numberOfQualifiedReferences')}
            resultMapper={groupedBigNumberKpiMapper}
            timeConfig={timeConfig}
            timeShiftConfig={timeShiftConfig}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            serviceId={serviceId}
            groupByTag={'call.meta_tags'}
            groupByTagSecondLevel={'destination_infra_reference'}
            tagFilters={[qualifiedReferencesFilter]}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.serviceMapping')}
            explanation={t('in-applications:serviceTroubleshooting.serviceMappingExplanation')}
            serviceId={serviceId}
            metricConfigs={[getServiceMappingMetricConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceMappingOutcome}
            colorMapper={serviceMappingColorMapper}
          />
        </Col>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraLinking')}
            explanation={t('in-applications:serviceTroubleshooting.infraLinkingExplanation')}
            serviceId={serviceId}
            metricConfigs={[getInfraLinkingMetricConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByInfraLinkingOutcome}
            colorMapper={infraLinkingColorMapper}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.serviceRuleId')}
            explanation={t('in-applications:serviceTroubleshooting.serviceRuleIdExplanation')}
            serviceId={serviceId}
            metricConfigs={[getGroupByServiceRuleId(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceRuleId}
          />
        </Col>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraReferenceType')}
            explanation={t('in-applications:serviceTroubleshooting.infraReferenceTypeExplanation')}
            serviceId={serviceId}
            metricConfigs={[getInfraReferenceTypeMetricConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByInfraReferenceType}
            colorMapper={infraReferenceColorMapper}
          />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.hostName')}
            explanation={t('in-applications:serviceTroubleshooting.hostNameExplanation')}
            serviceId={serviceId}
            metricConfigs={[getGroupByHostnameConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByHostname}
          />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.httpHost')}
            explanation={t('in-applications:serviceTroubleshooting.httpHostExplanation')}
            serviceId={serviceId}
            metricConfigs={[getGroupByHttpHostConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByHttpHost}
          />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.spanType')}
            explanation={t('in-applications:serviceTroubleshooting.spanTypeExplanation')}
            serviceId={serviceId}
            metricConfigs={[getGroupBySpanType(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupBySpanType}
          />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.processUptime')}
            explanation={t('in-applications:serviceTroubleshooting.processUptimeExplanation')}
            serviceId={serviceId}
            metricConfigs={[getGroupByProcessUptime(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByProcessUptime}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <AlternativeServicesChart
            timeConfig={timeConfig}
            serviceId={serviceId}
            correlationTag={'call.meta_tags'}
            correlationTagEntity={'NOT_APPLICABLE'}
            correlationTagSecondLevelKey={'destination_infra_reference'}
            cardHeader={
              <i>
                {t('in-applications:serviceTroubleshooting.alternativeServices', {
                  correlationTag: 'call.meta_tags.destination_infra_reference'
                })}
              </i>
            }
            cardTitle={t('in-applications:serviceTroubleshooting.alternativeServicesTitle')}
            metricDefinition={{
              label: 'alternativeServices',
              metric: 'calls',
              aggregation: 'SUM',
              formatter: number.compact,
              renderer: Renderer.line
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <AlternativeServicesChart
            timeConfig={timeConfig}
            serviceId={serviceId}
            correlationTag={'host.name'}
            correlationTagEntity={'DESTINATION'}
            cardHeader={
              <i>
                {t('in-applications:serviceTroubleshooting.alternativeServices', {
                  correlationTag: 'host.name'
                })}
              </i>
            }
            cardTitle={t('in-applications:serviceTroubleshooting.alternativeServicesTitle')}
            metricDefinition={{
              label: 'alternativeServices',
              metric: 'calls',
              aggregation: 'SUM',
              formatter: number.compact,
              renderer: Renderer.line
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <AlternativeServicesChart
            timeConfig={timeConfig}
            serviceId={serviceId}
            correlationTag={'call.http.host'}
            correlationTagEntity={'NOT_APPLICABLE'}
            cardHeader={
              <i>
                {t('in-applications:serviceTroubleshooting.alternativeServices', {
                  correlationTag: 'call.http.host'
                })}
              </i>
            }
            cardTitle={t('in-applications:serviceTroubleshooting.alternativeServicesTitle')}
            metricDefinition={{
              label: 'alternativeServices',
              metric: 'calls',
              aggregation: 'SUM',
              formatter: number.compact,
              renderer: Renderer.line
            }}
          />
        </Col>
      </Row>
    </>
  );
}
