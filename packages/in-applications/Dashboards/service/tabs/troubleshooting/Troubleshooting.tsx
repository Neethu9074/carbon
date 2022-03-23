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
} from 'in-applications/Dashboards/service/tabs/troubleshooting/metricConfigs';
import GroupBigNumberKpiCard, {
  groupedBigNumberKpiMapper
} from 'in-applications/Dashboards/service/tabs/troubleshooting/GroupedBigNumberKpiCard';
import AlternativeServicesChart from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesChart';
import InfraReferenceTypesInfoxBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/InfraReferenceTypesInfoxBox';
import ServiceMappingRulesInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/ServiceMappingRulesInfoBox';
import ServiceMappingInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/ServiceMappingInfoBox';
import InfraLinkingInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/InfraLinkingInfoBox';
import AlternativeServicesInfoBox from './infobox/AlternativeServicesInfoBox';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { syntheticCallsOptions } from 'in-applications/constants';
import Renderer from 'in-components/Chart/renderer/Renderer';
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
            problemStatement={t('in-applications:serviceTroubleshooting.serviceMappingProblemStatement')}
            renderInfoBox={ServiceMappingInfoBox}
            serviceId={serviceId}
            metricConfigs={[getServiceMappingMetricConfig(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceMappingOutcome}
            colorMapper={serviceMappingColorMapper}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraLinking')}
            problemStatement={t('in-applications:serviceTroubleshooting.infraLinkingProblemStatement')}
            renderInfoBox={InfraLinkingInfoBox}
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
            problemStatement={t('in-applications:serviceTroubleshooting.serviceRuleIdProblemStatement')}
            renderInfoBox={ServiceMappingRulesInfoBox}
            serviceId={serviceId}
            metricConfigs={[getGroupByServiceRuleId(serviceId)]}
            boundaryScope={boundaryScope}
            syntheticCalls={syntheticCalls}
            groupBy={groupByServiceRuleId}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.infraReferenceType')}
            problemStatement={t('in-applications:serviceTroubleshooting.infraReferenceTypeProblemStatement')}
            renderInfoBox={InfraReferenceTypesInfoxBox}
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
            problemStatement={t('in-applications:serviceTroubleshooting.hostNameProblemStatement')}
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
            problemStatement={t('in-applications:serviceTroubleshooting.httpHostProblemStatement')}
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
            problemStatement={t('in-applications:serviceTroubleshooting.spanTypeProblemStatement')}
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
            problemStatement={t('in-applications:serviceTroubleshooting.processUptimeProblemStatement')}
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
            cardHeader={
              <i>
                {t('in-applications:serviceTroubleshooting.alternativeServices', {
                  correlationTag: 'call.meta_tags.destination_infra_reference'
                })}
              </i>
            }
            cardTitle={t('in-applications:serviceTroubleshooting.alternativeServicesTitle')}
            renderInfoBox={AlternativeServicesInfoBox}
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
