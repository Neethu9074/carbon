/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/components/limitedFilters';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { fromBackendModel, isTagFilter } from 'in-components/QueryBuilder/transformation/formModel';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/mobileApp/lists/ScopeColumn.mless';

export default function ScopeColumn({
  config,
  mobileAppLabel
}: {
  config: MobileAppSmartAlertConfig;
  mobileAppLabel: string;
}) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression);
  const pages = tagFilterExpression.filter(isTagFilter).filter(filter => {
    return filter.name === 'mobileBeacon.mobileApp.name' && filter.operator !== 'NOT_EQUAL';
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
      {mobileAppLabel && (
        <span
          className={classNames({
            [locals.centered]: true,
            [locals.space]: pages.length === 0,
            [locals.divider]: pages.length > 0
          })}
        >
          <SvgIcon className={locals.filterIcon} type="lib_mobile_app" />
          {mobileAppLabel}
        </span>
      )}
      {pages.map((page, i) => (
        <span className={classNames(locals.centered, locals.space)} key={i}>
          <SvgIcon className={locals.filterIcon} type="lib_mobile_app_page_load" />
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
                t('in-alerting:smartAlerts.mobileApp.alertList.moreFiltersWithCount', {
                  count: filterCount - maxFilterToDisplay
                })}
            </div>
          }
          align="auto"
          forceTheme
          delay={500}
        >
          <span className={locals.centered}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-alerting:smartAlerts.mobileApp.alertList.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
