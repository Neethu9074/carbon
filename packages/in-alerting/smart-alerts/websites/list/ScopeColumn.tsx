/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { WebsiteAlertConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/websites/limitedFilters';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel, isTagFilter } from 'in-components/QueryBuilder/transformation/formModel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/Alerts.mless';

export default function ScopeColumn({ config, websiteLabel }: { config: WebsiteAlertConfig; websiteLabel: string }) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression);
  const pages = tagFilterExpression.filter(isTagFilter).filter(filter => {
    return filter.name === 'beacon.page.name' && filter.operator !== 'NOT_EQUAL';
  });
  const otherTagFiltersCount = tagFilterExpression.length - pages.length;

  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);

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
      {pages &&
        pages.map((page, i) => (
          <span className={classNames(locals.centered, locals.space)} key={i}>
            <SvgIcon className={locals.filterIcon} type="lib_website_page_load" />
            {page.stringValue}
          </span>
        ))}
      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <QueryBuilder value={filtersToDisplay} readOnly />
              {filterCount > maxFilterToDisplay &&
                t('in-websites:websiteDashboard.tabs.alerts.moreFiltersWithCount', {
                  count: filterCount - maxFilterToDisplay
                })}
            </div>
          }
          align="topMiddle"
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-websites:websiteDashboard.tabs.alerts.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
