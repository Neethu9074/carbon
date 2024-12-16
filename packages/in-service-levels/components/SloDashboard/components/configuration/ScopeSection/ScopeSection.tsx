/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  ApplicationSloEntity,
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  SloEntityType,
  WebsiteSloEntity
} from '@instana/types';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloConfigSection, {
  RowDefinition
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import {
  ApplicationSloTabData,
  isApplicationSloTabData,
  SloTabData
} from 'in-service-levels/components/SloDashboard/tabs';
import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import QueryBuilderFilter from 'in-service-levels/components/QueryBuilderFilter';
import { getLabelByType } from 'in-analyze/AnalyzeView/dataSources';

import locals from './ScopeSection.mless';

interface ScopeSectionProps {
  data: SloTabData | ApplicationSloTabData;
}

const contentDefinitions: Record<Exclude<SloEntityType, 'synthetic'>, RowDefinition[]> = {
  application: [
    {
      id: 'boundaryScope',
      columns: [{ getContent: BoundaryScopeColumn }]
    },
    {
      id: 'hiddenCalls',
      columns: [{ getContent: HiddenCallsColumn }]
    },
    {
      id: 'service-endpoint',
      columns: [{ getContent: ServiceColumn }, { getContent: EndpointColumn }]
    },
    {
      id: 'customFilter',
      columns: [{ getContent: ApplicationCustomFilterColumn }],
      shouldRender: data => Boolean(data.configuration.entity.tagFilterExpression)
    }
  ],
  website: [
    { id: 'beaconType', columns: [{ getContent: BeaconTypeColumn }] },
    {
      id: 'customFilter',
      columns: [{ getContent: WebsiteCustomFilterColumn }],
      shouldRender: data => Boolean(data.configuration.entity.tagFilterExpression)
    }
  ]
};

export default function ScopeSection({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;

  if (isSyntheticSloEntity(entity)) return <></>;

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

  const doesIncludeInternalCalls: boolean = entity.includeInternal ?? false;
  const doesIncludeSyntheticCalls: boolean = entity.includeSynthetic ?? false;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsLabel')}
      value={
        <ul className={locals.listUnstyled}>
          <li>
            {t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsInternal', {
              context: String(doesIncludeInternalCalls)
            })}
          </li>
          <li>
            {t('in-service-levels:sloDashboard.components.scopeSection.apHiddenCallsSynthetic', {
              context: String(doesIncludeSyntheticCalls)
            })}
          </li>
        </ul>
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
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}
      value={<QueryBuilderFilter entity={entity} QueryBuilderComponent={QueryBuilder} />}
    />
  );
}

function WebsiteCustomFilterColumn({ data }: ScopeSectionProps) {
  const { configuration } = data;
  const { entity } = configuration;
  const { QueryBuilder } = useWebsiteQueryBuilder(entity as WebsiteSloEntity);

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}
      value={<QueryBuilderFilter entity={entity} QueryBuilderComponent={QueryBuilder} />}
    />
  );
}
