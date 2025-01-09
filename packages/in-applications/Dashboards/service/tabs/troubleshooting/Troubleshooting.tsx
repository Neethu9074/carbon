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
import AlternativeServicesInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/AlternativeServicesInfoBox';
import ServiceMappingInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/ServiceMappingInfoBox';
import InfraLinkingInfoBox from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/InfraLinkingInfoBox';
import TroubleShootingChart from 'in-applications/Dashboards/service/tabs/troubleshooting/TroubleShootingChart';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import { Service, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface TroubleShootingProps {
  timeConfig: TimeConfig;
  serviceId: string;
  boundaryScope: string;
  data: Service;
}

export default function Troubleshooting(props: TroubleShootingProps) {
  const timeShiftConfig = useTimeShiftConfig();
  const { timeConfig, serviceId, boundaryScope, data } = props;
  const endpointTypes = data.types;

  return (
    <>
      <KpiGridRow sizes={[4, 4, 4]}>
        <GroupBigNumberKpiCard
          title={t('in-applications:serviceTroubleshooting.numberOfHosts')}
          resultMapper={groupedBigNumberKpiMapper}
          timeConfig={timeConfig}
          timeShiftConfig={timeShiftConfig}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          tagFilters={[
            tagFilter('host.name', NOT_EMPTY, '', null, DESTINATION),
            ...filterByEndpointType(endpointTypes)
          ]}
          groupByTag={'host.name'}
          groupByTagEntity={DESTINATION}
        />
        <GroupBigNumberKpiCard
          title={t('in-applications:serviceTroubleshooting.numberOfHostnames')}
          resultMapper={groupedBigNumberKpiMapper}
          timeConfig={timeConfig}
          timeShiftConfig={timeShiftConfig}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          tagFilters={filterByEndpointType(endpointTypes)}
          groupByTag={'call.http.host'}
        />
        <GroupBigNumberKpiCard
          title={t('in-applications:serviceTroubleshooting.numberOfQualifiedReferences')}
          resultMapper={groupedBigNumberKpiMapper}
          timeConfig={timeConfig}
          timeShiftConfig={timeShiftConfig}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          groupByTag={'call.meta_tags'}
          groupByTagSecondLevel={'destination_infra_reference'}
          tagFilters={[qualifiedReferencesFilter, ...filterByEndpointType(endpointTypes)]}
        />
      </KpiGridRow>
      <Row>
        <Col xs>
          <TroubleShootingChart
            title={t('in-applications:serviceTroubleshooting.serviceMapping')}
            problemStatement={t('in-applications:serviceTroubleshooting.serviceMappingProblemStatement')}
            renderInfoBox={ServiceMappingInfoBox}
            serviceId={serviceId}
            metricConfigs={[getServiceMappingMetricConfig(serviceId)]}
            boundaryScope={boundaryScope}
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
            title={t('in-applications:serviceTroubleshooting.alternativeServicesTitle')}
            renderInfoBox={AlternativeServicesInfoBox}
            metricDefinition={{
              label: 'alternativeServices',
              metric: 'calls',
              aggregation: 'SUM',
              formatter: number.compact,
              renderer: Renderer.bar
            }}
          />
        </Col>
      </Row>
    </>
  );
}
