/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  ApplicationSloEntity,
  SloEntity,
  WebsiteSloEntity,
  isApplicationSloEntity,
  isWebsiteSloEntity
} from '@instana/types';
import { KeyValue } from '@instana/components';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import QueryBuilderFilter from 'in-service-levels/components/QueryBuilderFilter';
import { t } from 'in-i18n';

interface SloConfigCustomFilterProps {
  sloEntity: SloEntity;
}

export default function SloConfigCustomFilter({ sloEntity }: SloConfigCustomFilterProps) {
  if (isApplicationSloEntity(sloEntity)) return <ApplicationCustomFilter applicationSloEntity={sloEntity} />;
  if (isWebsiteSloEntity(sloEntity)) return <WebsiteCustomFilter websiteSloEntity={sloEntity} />;

  throw Error('Unknown SLO entity');
}

interface ApplicationCustomFilterProps {
  applicationSloEntity: ApplicationSloEntity;
}

function ApplicationCustomFilter({ applicationSloEntity }: ApplicationCustomFilterProps) {
  const { QueryBuilder } = useApplicationQueryBuilder(applicationSloEntity);
  return (
    <KeyValue
      multilineValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}
      value={<QueryBuilderFilter entity={applicationSloEntity} QueryBuilderComponent={QueryBuilder} />}
    />
  );
}

interface WebsiteCustomFilterProps {
  websiteSloEntity: WebsiteSloEntity;
}

function WebsiteCustomFilter({ websiteSloEntity }: WebsiteCustomFilterProps) {
  const { QueryBuilder } = useWebsiteQueryBuilder(websiteSloEntity);

  return (
    <KeyValue
      multilineValue
      label={t('in-service-levels:sloDashboard.components.scopeSection.customFilterLabel')}
      value={<QueryBuilderFilter entity={websiteSloEntity} QueryBuilderComponent={QueryBuilder} />}
    />
  );
}
