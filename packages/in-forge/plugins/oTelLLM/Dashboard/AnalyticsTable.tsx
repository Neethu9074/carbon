/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { DESTINATION, SOURCE } from 'in-components/QueryBuilder/tagFilter/entities';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import Table from 'in-sdk/components/dashboard/Table';
import { TagFilterEntity } from 'in-types';
import { t } from 'in-i18n';

type Row = {
  service: string;
  key: string;
  name: string;
};

type AnalyticsTableProps = {
  services: string[];
  title: string;
};

const AnalyticsTable = ({ services, title }: AnalyticsTableProps) => {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const generateLink = (service: string) => {
    const createTagFilter = (entity: TagFilterEntity) => tagFilter('service.name', EQUALS, service, null, entity);
    const filters = [SOURCE, DESTINATION].map(createTagFilter);
    const link = getLinkToApplicationAnalyze({
      formModel: joinExpressions({
        logicalOperator: 'OR',
        expressions: filters
      })
    });
    return <Link href={link}>{t('in-forge:plugins.oTelLLM.dashboard.calls')}</Link>;
  };

  const serviceCol = {
    title: t('in-forge:plugins.oTelLLM.dashboard.service'),
    type: 'string',
    typeArgs: {
      getValue: (row: Row) => row.service
    }
  };

  const callsCol = {
    title: t('in-forge:plugins.oTelLLM.dashboard.calls'),
    type: 'string',
    typeArgs: {
      getValue: (row: Row) => row.service,
      getContent: generateLink
    }
  };
  const rows: Row[] = services
    ?.map(service => {
      const match = /^llm\.service\.request\.count\.(.*)\.value$/.exec(service);
      return match?.[1] ?? null;
    })
    .filter((service): service is string => service !== null)
    .sort((a, b) => a.localeCompare(b))
    .map(service => ({ key: service, name: service, service }));

  if (!rows || rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={title} cols={[serviceCol, callsCol]} rows={rows} />;
};

export default AnalyticsTable;
