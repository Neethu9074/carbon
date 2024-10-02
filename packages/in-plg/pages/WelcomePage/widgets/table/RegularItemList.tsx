/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardTableRow as Row, DashboardTableCell as Cell } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { DEFAULT_NUMBER_SKELETON_ROWS } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import LoadingTableList from 'in-plg/pages/WelcomePage/widgets/table/LoadingTableList';
import { getItemId } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';

interface RegItemListProps {
  result: any;
  columnDefinitions: ColumnDefinitionItem[];
  timeConfig: TimeConfig;
  numSkeletonRows: number;
  favIds?: string[];
  widgetName?: string;
}

export default function RegularItemList({
  result,
  columnDefinitions,
  timeConfig,
  numSkeletonRows,
  favIds,
  widgetName
}: RegItemListProps) {
  if (!result || isLoading(result)) {
    numSkeletonRows = favIds ? DEFAULT_NUMBER_SKELETON_ROWS - favIds.length : DEFAULT_NUMBER_SKELETON_ROWS;
    return (
      <LoadingTableList
        numSkeletonRows={numSkeletonRows}
        numSkeletonColumns={columnDefinitions.length}
        favPresent={!!favIds?.length}
      />
    );
  }
  if (hasError(result)) {
    return <ErrorList errors={result.errors} />;
  }
  const resultItems = result.data.items ?? result.data;
  return resultItems
    ?.filter((item: any) => !favIds?.includes(getItemId(item, widgetName)))
    .slice(0, numSkeletonRows)
    .map((item: any, index: number) => (
      <Row id={`${index}`} key={index}>
        {columnDefinitions?.map(({ key, getContent }: ColumnDefinitionItem) => (
          <Cell key={key} {...(key === 'favourite' && { className: 'favouriteIcon' })}>
            {getContent({ item, result, timeConfig })}
          </Cell>
        ))}
      </Row>
    ));
}
