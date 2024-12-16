/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { TagFilter } from '@instana/types';

import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/components/limitedFilters';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel, isTagFilter } from 'in-components/QueryBuilder/transformation/formModel';
import { WebsiteSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/list/ScopeColumn.mless';

export default function ScopeColumn({
  config,
  websiteLabel
}: {
  config: WebsiteSmartAlertConfig;
  websiteLabel: string;
}) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression);
  const pages = tagFilterExpression.filter(isTagFilter).filter(filter => {
    return filter.name === 'beacon.page.name' && filter.operator !== 'NOT_EQUAL';
  });
  const maxFilterToDisplayInColumn = 3;
  const maxPageNamesToShowInTooltip = 10;
  const maxPageNamesIndex = maxFilterToDisplayInColumn + maxPageNamesToShowInTooltip;
  const hasMorePageNames = pages.length > maxPageNamesIndex;

  const pageNames =
    pages.length > maxFilterToDisplayInColumn ? getFilterPages(pages, 0, maxFilterToDisplayInColumn) : pages;

  const otherPageNamesCount = pages.length - maxFilterToDisplayInColumn;

  const otherTagFiltersCount = tagFilterExpression.length - pages.length;

  const filterCount = getFiltersCount(tagFilterExpression);

  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplayInColumn);

  const blueprintConfig = getBlueprintConfig(config.rule.alertType);
  const beaconType = blueprintConfig.getBeaconType(config.rule.metricName as MetricName);
  const { QueryBuilder } = getQueryBuilderForBeaconType(beaconType);

  return (
    <div className={locals.filters}>
      {websiteLabel && (
        <span
          className={classNames({
            [locals.centered]: true,
            [locals.space]: pages.length === 0,
            [locals.divider]: pages.length > 0
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_website" />
          {websiteLabel}
        </span>
      )}

      {pageNames.map((page, i) => (
        <span className={classNames(locals.centered, locals.space)} key={i}>
          <SvgIcon className={locals.filterIcon} type="lib_website_page_load" />
          {page.stringValue}
        </span>
      ))}
      {otherPageNamesCount >= 1 && (
        <span className={classNames(locals.centered)}>
          <Tooltip
            themeStyle="light"
            content={getToolTipContent(
              pages,
              maxFilterToDisplayInColumn,
              maxPageNamesIndex,
              hasMorePageNames,
              maxPageNamesToShowInTooltip
            )}
            align="topMiddle"
            delay={500}
          >
            <span className={classNames(locals.space)}>
              {t('in-alerting:smartAlerts.eum.more', {
                count: otherPageNamesCount
              })}
            </span>
          </Tooltip>
        </span>
      )}

      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <QueryBuilder value={filtersToDisplay} readOnly />
              {filterCount > maxFilterToDisplayInColumn &&
                t('in-alerting:smartAlerts.websites.list.columns.moreFiltersWithCount', {
                  count: filterCount - maxFilterToDisplayInColumn
                })}
            </div>
          }
          align="auto"
          forceTheme
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-alerting:smartAlerts.websites.list.columns.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}

function getFilterPages(pages: TagFilter[], start: number, end: number) {
  return pages.slice(start, end);
}

function getToolTipContent(
  pages: TagFilter[],
  maxFilterToDisplay: number,
  maxPageNamesIndex: number,
  hasMorePageNames: boolean,
  maxPageNamesToShow: number
) {
  const filteredPages = getFilterPages(pages, maxFilterToDisplay, maxPageNamesIndex);

  return (
    <div>
      {filteredPages.map((page, i) => {
        const shouldShowViewMore = hasMorePageNames && i === maxPageNamesToShow - 1;
        return (
          <span className={classNames(locals.centered, locals.pageNames)} key={i}>
            <SvgIcon className={locals.filterIcon} type="lib_website_page_load" />
            {page.stringValue}
            {shouldShowViewMore && (
              <span className={classNames(locals.centered, locals.viewMore)}>
                {t('in-alerting:smartAlerts.eum.viewMore')}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
