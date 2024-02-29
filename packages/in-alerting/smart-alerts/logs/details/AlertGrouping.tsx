/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import HelpText from 'in-components/form/HelpText';
import { TagFilter } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/details/AlertGrouping.mless';

interface AlertGroupingProps {
  AlertQueryBuilder: QueryBuilderComponent;
  groupBy: string[];
}

export function AlertGrouping({ AlertQueryBuilder, groupBy }: AlertGroupingProps) {
  if (!groupBy.length) {
    return null;
  }
  const groupingFE = getGroupingFE(groupBy);

  return (
    <Stack gap="xsmall">
      <>
        <HelpText>{t('in-alerting:components.groupBy')}</HelpText>
        <div className={locals.wrapper}>
          {groupingFE.map(
            (item, i) =>
              (
                <AlertQueryBuilder value={fromBackendModel(item)} readOnly key={i} />
              ) as unknown as QueryBuilderComponent
          )}
        </div>
      </>
    </Stack>
  );
}

export function getGroupingFE(groupBy: string[]) {
  if (!groupBy.length) {
    return [];
  }
  const groupingFE: TagFilter[] = [];
  groupBy.forEach((groupName: string) => {
    groupingFE.push({
      value: '',
      //@ts-expect-error groupby doesnot have operator
      operator: '',
      name: groupName,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  });
  return groupingFE;
}
