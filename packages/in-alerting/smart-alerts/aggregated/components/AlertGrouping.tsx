/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';
import { TagFilter } from '@instana/types';

import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import HelpText from 'in-components/form/HelpText';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/aggregated/components/AlertGrouping.mless';

interface AlertGroupingProps {
  AlertQueryBuilder: QueryBuilderComponent;
  groupBy?: TagFilter[];
}

export function AlertGrouping({ AlertQueryBuilder, groupBy }: AlertGroupingProps) {
  if (!groupBy) {
    return null;
  }

  return (
    <Stack gap="xsmall">
      <>
        <HelpText>{t('in-alerting:components.groupBy')}</HelpText>
        <div className={locals.wrapper}>
          {groupBy.map(
            (item, i) =>
              (
                <AlertQueryBuilder value={fromBackendModel(item as TagFilter)} readOnly key={i} />
              ) as unknown as QueryBuilderComponent
          )}
        </div>
      </>
    </Stack>
  );
}
