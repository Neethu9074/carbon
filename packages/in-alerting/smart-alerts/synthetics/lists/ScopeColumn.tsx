/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/components/limitedFilters';
import { getQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/lists/ScopeColumn.mless';

export default function ScopeColumn({ config }: { config: SyntheticAlertConfig }) {
  const tagFilterExpression = fromBackendModel(config.tagFilterExpression);

  const otherTagFiltersCount = tagFilterExpression.length;

  const filterCount = getFiltersCount(tagFilterExpression);

  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);
  const { QueryBuilder } = getQueryBuilder();

  return (
    <div className={locals.filters}>
      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <QueryBuilder value={filtersToDisplay} readOnly />
              {filterCount > maxFilterToDisplay &&
                t('in-alerting:smartAlerts.synthetics.dashboard.column.moreFiltersWithCount', {
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
            {t('in-alerting:smartAlerts.synthetics.dashboard.column.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
