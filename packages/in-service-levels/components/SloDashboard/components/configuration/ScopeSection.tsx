/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  ApplicationSloEntity,
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityType,
  WebsiteSloEntity
} from '@instana/types';
import { KeyValue, Spacer, Stack, SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloConfigSection, {
  RowDefinition
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import {
  ApplicationSloTabData,
  isApplicationSloTabData,
  SloTabData
} from 'in-service-levels/components/SloDashboard/tabs';
import { QueryBuilderComponent as QueryBuilderComponentType } from 'in-components/QueryBuilder';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getLabelByType } from 'in-analyze/AnalyzeView/dataSources';

interface ScopeSectionProps {
  data: SloTabData | ApplicationSloTabData;
}

const contentDefinitions: Record<SloEntityType, RowDefinition[]> = {
  application: [
    { id: 'boundaryScope', columns: [{ getContent: BoundaryScopeColumn, verticallyCenter: true }] },
    { id: 'hiddenCalls', columns: [{ getContent: HiddenCallsColumn, verticallyCenter: true }] },
    {
      id: 'service-endpoint',
      columns: [
        { getContent: ServiceColumn, verticallyCenter: true },
        { getContent: EndpointColumn, verticallyCenter: true }
      ]
    },
    {
      id: 'customFilter',
      columns: [{ getContent: ApplicationCustomFilterColumn, verticallyCenter: true }],
      shouldRender: data => Boolean(data.configuration.entity.tagFilterExpression)
    }
  ],
  website: [
    { id: 'beaconType', columns: [{ getContent: BeaconTypeColumn, verticallyCenter: true }] },
    {
      id: 'customFilter',
      columns: [
        {
          getContent: WebsiteCustomFilterColumn,
          verticallyCenter: true
        }
      ],
      shouldRender: data => Boolean(data.configuration.entity.tagFilterExpression)
    }
  ]
};

export default function ScopeSection({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;
  const { type } = entity;
  return (
    <SloConfigSection
      data={data}
      label={t('in-service-levels:sloDashboard.components.scopeSection.title')}
      contentDefinitions={contentDefinitions[type] ?? []}
    />
  );
}

function BoundaryScopeColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (!isApplicationSloEntity(entity)) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.apBoundaryScopeLabel')}
      value={t('in-service-levels:sloDashboard.components.scopeSection.apBoundaryScope', {
        context: entity.boundaryScope
      })}
    />
  );
}

function HiddenCallsColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (!isApplicationSloEntity(entity)) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsLabel')}
      value={
        <Stack direction="horizontal" distribution="start" align="center" gap="xxsmall">
          <SvgIcon
            type={entity.includeInternal ? 'lib_check' : 'lib_openclose_cancel'}
            size="s"
            aria-label={
              entity.includeInternal
                ? t('in-service-levels:sloDashboard.components.scopeSection.ariaLabelChecked')
                : t('in-service-levels:sloDashboard.components.scopeSection.ariaLabelUnchecked')
            }
          />
          {t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsInternal')}
          <Spacer size="small" />
          <SvgIcon
            type={entity.includeSynthetic ? 'lib_check' : 'lib_openclose_cancel'}
            size="s"
            aria-label={
              entity.includeSynthetic
                ? t('in-service-levels:sloDashboard.components.scopeSection.ariaLabelChecked')
                : t('in-service-levels:sloDashboard.components.scopeSection.ariaLabelUnchecked')
            }
          />
          {t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsSynthetic')}
        </Stack>
      }
    />
  );
}

function ServiceColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (!isApplicationSloEntity(entity)) return null;

  const value =
    entity.serviceId && isApplicationSloTabData(data)
      ? data.service?.label ?? ''
      : t('in-service-levels:sloDashboard.components.scopeSection.apAllServices');
  return <KeyValue label={t('in-service-levels:sloDashboard.components.scopeSection.apServiceLabel')} value={value} />;
}

function EndpointColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (!isApplicationSloEntity(entity)) return null;

  const value =
    entity.endpointId && isApplicationSloTabData(data)
      ? data.endpoint?.label ?? ''
      : t('in-service-levels:sloDashboard.components.scopeSection.apAllEndpoints');
  return <KeyValue label={t('in-service-levels:sloDashboard.components.scopeSection.apEndpointLabel')} value={value} />;
}

function BeaconTypeColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (!isWebsiteSloEntity(entity)) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.eumBeaconTypeLabel')}
      value={getLabelByType(entity.beaconType)}
    />
  );
}

function ApplicationCustomFilterColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;
  const { QueryBuilder } = useApplicationQueryBuilder(entity as ApplicationSloEntity);
  return <CustomFilterColumn configuration={configuration} QueryBuilderComponent={QueryBuilder} />;
}

function WebsiteCustomFilterColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;
  const { QueryBuilder } = useWebsiteQueryBuilder(entity as WebsiteSloEntity);
  return <CustomFilterColumn configuration={configuration} QueryBuilderComponent={QueryBuilder} />;
}

interface CustomFilterColumnProps {
  configuration: ServiceLevelObjectiveConfiguration;
  QueryBuilderComponent: QueryBuilderComponentType;
}

function CustomFilterColumn({ configuration, QueryBuilderComponent }: CustomFilterColumnProps) {
  const { entity } = configuration;
  const { tagFilterExpression } = entity;

  if (!tagFilterExpression) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}
      value={<QueryBuilderComponent value={fromBackendModel(tagFilterExpression)} readOnly />}
    />
  );
}
