/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { TagCatalog } from '@instana/types';

import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/components/limitedFilters';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { getQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LogScopePath from 'in-alerting/smart-alerts/logs/components/LogScopePath';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/lists/ScopeColumn.mless';

export default function ScopeColumn({ config }: { config: LogSmartAlertConfigWithMetadata }) {
  const { tagFilterExpression } = config;

  const tagCatalog = useTagCatalog('SMART_ALERTS');
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const otherTagFiltersCount = tagFilterFormModel.length;
  const filterCount = getFiltersCount(tagFilterFormModel);
  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterFormModel, maxFilterToDisplay);

  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  return (
    <div className={locals.filters}>
      <LogScopePath entityLabel={t('in-alerting:smartAlerts.logs.logCount')} />
      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <AlertQueryBuilder value={filtersToDisplay} readOnly />
              {filterCount > maxFilterToDisplay &&
                t('in-alerting:smartAlerts.logs.list.moreFiltersWithCount', {
                  count: filterCount - maxFilterToDisplay
                })}
            </div>
          }
          align="auto"
          forceTheme
          delay={500}
        >
          <span className={classNames(locals.centered, locals.space)}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-alerting:smartAlerts.logs.list.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
