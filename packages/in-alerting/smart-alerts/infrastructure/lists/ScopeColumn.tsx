/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { TagCatalog } from '@instana/types';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
// eslint-disable-next-line no-restricted-imports
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { getFiltersCount, getLimitedNumberOfFilters } from 'in-alerting/smart-alerts/components/limitedFilters';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getPluginName } from 'in-sdk/pluginName';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/lists/ScopeColumn.mless';

export default function ScopeColumn({ config }: { config: InfraSmartAlertConfigWithMetadata }) {
  const {
    rule: { entityType },
    tagFilterExpression
  } = config;

  const tagCatalog = useTagCatalog({ ownerType: entityType });
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const otherTagFiltersCount = tagFilterFormModel.length;
  const filterCount = getFiltersCount(tagFilterFormModel);
  const maxFilterToDisplay = 3;
  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterFormModel, maxFilterToDisplay);

  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  return (
    <div className={locals.filters}>
      {entityType && (
        <Tooltip content={getPluginName(entityType, 1)} align="topLeft" delay={500}>
          <WithIcon plugin={entityType} iconColor={themes.default.ids.color.option.neutral['700']}>
            {getPluginName(entityType, 1)}
          </WithIcon>
        </Tooltip>
      )}

      {otherTagFiltersCount >= 1 && (
        <Tooltip
          themeStyle="light"
          content={
            <div>
              <AlertQueryBuilder value={filtersToDisplay} readOnly />
              {filterCount > maxFilterToDisplay &&
                t('in-alerting:smartAlerts.infrastructure.list.moreFiltersWithCount', {
                  count: filterCount - maxFilterToDisplay
                })}
            </div>
          }
          align="auto"
          delay={500}
          forceTheme
        >
          <span className={classNames(locals.centered, locals.space)}>
            <SvgIcon className={locals.filterIcon} type="lib_actions_filter" />
            {t('in-alerting:smartAlerts.infrastructure.list.filter', {
              count: filterCount
            })}
          </span>
        </Tooltip>
      )}
    </div>
  );
}
