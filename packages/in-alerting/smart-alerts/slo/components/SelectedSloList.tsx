/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { PaginatedResult, ServiceLevelsAlertConfig } from '@instana/types';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import { createEntityIdUrlParameter, createTagsUrlParameter } from 'in-service-levels/navigation/urlParameters';
import SloEntityColumnContent from 'in-service-levels/components/SloList/components/SloEntityColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { GetAllSloConfigurationsArguments } from 'in-service-levels/api/configuration';
import { serviceLevelsAlertDetailsSegment } from 'in-service-levels/navigation/path';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { buildSloListItem } from 'in-service-levels/hooks/useSloListItems';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { all as allProgress } from 'in-hooks/utils/progress';
import { pathSegment } from 'in-synthetics/utils/constants';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

function getColumnDefinitions(): ColumnDefinition<SloListItem>[] {
  return [
    {
      id: 'name',
      label: t('in-service-levels:sloList.columnLabels.name'),
      getContent: item => <SloNameColumnContent item={item} />,
      width: 23,
      sortable: true
    },
    {
      id: 'entityType',
      label: t('in-service-levels:sloList.columnLabels.entity'),
      getContent: item => <SloEntityColumnContent item={item} />,
      width: 18.5,
      sortable: false
    },
    {
      id: 'blueprint',
      label: t('in-service-levels:sloList.columnLabels.blueprint'),
      getContent: item => <SloBlueprintColumnContent item={item} />,
      width: 8,
      sortable: false
    }
  ];
}

const matrixPrefix = '';

interface SelectedSloListProps {
  sloAlertConfig: ServiceLevelsAlertConfig;
}

export default function SelectedSloList({ sloAlertConfig }: SelectedSloListProps) {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = useServerTableUrlState({
    pathSegment: serviceLevelsAlertDetailsSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createEntityIdUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix)
    ]
  });
  const [result, , , progress] = useSloListItems({
    ids: sloAlertConfig.sloIds,
    page,
    pageSize,
    orderBy,
    orderDirection,
    query
  });

  const actualPage = result?.page ?? page;
  const actualPageSize = result?.pageSize ?? pageSize;

  return (
    <ServerTablePresenter<SloListItem, ServerTablePresenterProps<SloListItem>>
      page={actualPage}
      pageSize={actualPageSize}
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      columnDefinitions={getColumnDefinitions()}
      result={{
        progress,
        errors: [],
        data: result
      }}
      onChange={setServerTableState}
      fixedLayout
    />
  );
}

function useSloListItems({
  ids,
  page,
  pageSize,
  query,
  orderBy,
  orderDirection
}: GetAllSloConfigurationsArguments): FetchedState<PaginatedResult<SloListItem>> {
  const timeConfig = useTimeConfig();
  const [configurationPage, , configurationErrors, configurationProgress] = useSloConfigurations({
    ids,
    page,
    pageSize,
    query,
    orderBy,
    orderDirection
  });
  const configurations = configurationPage?.items ?? [];
  const [labels, , , labelsProgress] = useSloEntitiesLabels(configurations);

  const progress = allProgress(configurationProgress, labelsProgress);

  return [
    {
      ...configurationPage!,
      items: configurations.map(configuration => buildSloListItem({ configuration, labels, timeConfig }))
    },
    'resolved',
    configurationErrors,
    progress
  ];
}
