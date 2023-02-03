/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getGroupTagValue } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import EntityLink from 'in-components/EntityLink/EntityLink';
import CsvExporter from 'in-components/CsvExporter';
import { t } from 'in-i18n';

export default function EntityListPresenter({ order, result, onChange }) {
  const columnDefinitions = [
    {
      id: 'label',
      width: '8rem',
      label: t('in-infrastructure:explore.name'),
      sortable: true,
      getContent(item) {
        const value = getGroupTagValue(item, 'type');
        return (
          <div>
            <EntityLink
              label={value}
              plugin={item.tags['type']}
              href$={getLinkToExplore({ type: item.tags['type'], group: {} })}
            />
          </div>
        );
      }
    },
    {
      id: 'count',
      width: '8rem',
      label: t('in-infrastructure:explore.count'),
      sortable: true,
      getContent(item) {
        return (
          <>
            <span>{item.count}</span>
          </>
        );
      }
    }
  ];

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Count', key: 'count' }
  ];

  function getCsvItems() {
    return result?.data?.items.map(item => ({ name: getGroupTagValue(item, 'type'), count: item.count })) || [];
  }

  return (
    <ServerTablePresenter
      orderBy={order.by}
      orderDirection={order.direction}
      result={result}
      columnDefinitions={columnDefinitions}
      cardTitle={t('in-infrastructure:explore.entityTypes', { count: result?.data?.items?.length ?? '' })}
      onChange={onChange}
      rightHeader={<CsvExporter headers={headers} data={getCsvItems()} fileName="entity_types.csv" />}
      searchPlaceholder={t('in-infrastructure:explore.search')}
      withoutSearchIcon
    />
  );
}
