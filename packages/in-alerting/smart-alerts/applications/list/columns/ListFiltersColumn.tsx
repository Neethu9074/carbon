/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ApplicationAlertRuleUnion, ThresholdConfigUnion } from 'in-types';
import IconLabel from 'in-alerting/components/IconLabel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/list/columns/ListColumns.mless';

const maxFilterToDisplay = 3;

interface ListFilterColumnProps {
  tagFilterExpression: FormModelElement[];
  rule: ApplicationAlertRuleUnion;
  threshold: ThresholdConfigUnion;
}

export default function ListFilterColumn({ tagFilterExpression, rule, threshold }: ListFilterColumnProps) {
  const { QueryBuilder } = getQueryBuilderForAlertType(rule.alertType, threshold.type);

  const filtersToDisplay = getLimitedNumberOfFilters(tagFilterExpression, maxFilterToDisplay);
  const filterCount = getFiltersCount(tagFilterExpression);

  return (
    <Tooltip
      themeStyle="light"
      content={
        <div>
          <QueryBuilder value={filtersToDisplay} readOnly />
          <span className={locals.moreItems}>
            {filterCount > maxFilterToDisplay &&
              t('in-applications:alert.tooltipMoreFilter', {
                count: filterCount,
                moreFilterCount: filterCount - maxFilterToDisplay
              })}
          </span>
        </div>
      }
      align="auto"
      forceTheme
      delay={500}
    >
      <IconLabel
        text={t('in-alerting:smartAlerts.applications.inventory.labelAlertFilters')}
        type="lib_actions_filter"
        noBottomMargin
      />
    </Tooltip>
  );
}

function getFiltersCount(tagFilterExpression: FormModelElement[]) {
  return tagFilterExpression.reduce((count, element) => {
    return element.type === 'TAG_FILTER' ? count + 1 : count;
  }, 0);
}

function getLimitedNumberOfFilters(tagFilterExpression: FormModelElement[], maxFilterToDisplay: number) {
  const filtersToDisplay = [];
  let tagFilterCount = 0;

  for (const item of tagFilterExpression) {
    if (tagFilterCount === maxFilterToDisplay) {
      break;
    }
    filtersToDisplay.push(item);

    if (item.type === 'TAG_FILTER') {
      tagFilterCount++;
    }
  }

  return filtersToDisplay;
}
