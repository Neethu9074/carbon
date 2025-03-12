/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonTableRow as Row, CarbonTableCell as Cell } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { DEFAULT_NUMBER_ROWS } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import LoadingTableList from 'in-plg/pages/WelcomePage/widgets/table/LoadingTableList';
import { getItemId } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import { hasError, isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from 'in-plg/pages/WelcomePage/widgets/table/CommonTableStyle.mless';

interface RegItemListProps {
  result: any;
  columnDefinitions: ColumnDefinitionItem[];
  timeConfig: TimeConfig;
  numSkeletonRows: number;
  favIds?: string[];
  widgetName?: string;
  mainPage?: boolean;
  pageSize?: number;
}

export default function RegularItemList({
  result,
  columnDefinitions,
  timeConfig,
  numSkeletonRows,
  favIds,
  widgetName,
  mainPage,
  pageSize
}: RegItemListProps) {
  const favPresent = columnDefinitions.some(item => item.key === 'favourite') ?? false;
  if (!result || isLoading(result)) {
    numSkeletonRows =
      mainPage && pageSize ? pageSize : favIds ? DEFAULT_NUMBER_ROWS - favIds.length : DEFAULT_NUMBER_ROWS;
    const numSkeletonColumns = mainPage
      ? favPresent
        ? columnDefinitions.length - 1
        : columnDefinitions.length
      : columnDefinitions.length;
    return (
      <LoadingTableList
        numSkeletonRows={numSkeletonRows}
        numSkeletonColumns={numSkeletonColumns}
        favPresent={favPresent && !mainPage}
      />
    );
  }
  if (hasError(result)) {
    return (
      <Row>
        {columnDefinitions.map(({ key }: ColumnDefinitionItem) => {
          if (mainPage && key === 'favourite') return null;
          return (
            <Cell key={key}>
              {(key === 'name' || key === 'title') && (
                <Tooltip content={getUniqueErrors(result.errors)[0]} align="auto" caret={false} delay={300}>
                  <div className={locals.errorTitleWidthForTooltip}>{'-'}</div>
                </Tooltip>
              )}
            </Cell>
          );
        })}
      </Row>
    );
  }
  const resultItems = result.data.items ?? result.data;
  return resultItems
    ?.filter((item: any) => (mainPage ? true : !favIds?.includes(getItemId(item, widgetName))))
    .slice(0, numSkeletonRows)
    .map((item: any, index: number) => (
      <Row id={`${widgetName}-regular-${index}`} key={index}>
        {columnDefinitions?.map(({ key, getContent }: ColumnDefinitionItem) => {
          if (mainPage && key === 'favourite') return null;
          return (
            <Cell key={key} {...(key === 'favourite' && { className: 'favouriteIcon' })}>
              {getContent({ item, result, timeConfig })}
            </Cell>
          );
        })}
      </Row>
    ));
}
