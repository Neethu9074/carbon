/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RecommendedAction } from '@instana/types';
import { Typography } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { turboActionCategoryMap } from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import WithSubscript from 'in-settings/components/WithSubscript';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

export const nameColumn: ColumnDefinition<RecommendedAction> = {
  id: 'name',
  label: t('in-automation:name'),
  ellipsis: true,
  getContent(recAction) {
    const name = recAction.name;
    return (
      <Tooltip content={name} align="auto" delay={500} overwriteBlock caret={false}>
        <WithSubscript subscript={recAction.actionType}>
          <Typography noWrap variant="body-regular">
            {name}
          </Typography>
        </WithSubscript>
      </Tooltip>
    );
  },
  width: 25,
  sortable: true
};

export const impactedApplicationsColumn: ColumnDefinition<RecommendedAction> = {
  label: t('in-automation:resourceOptimization.impactedApplications'),
  id: 'score',
  width: 10,
  sortable: true,
  getContent(recAction) {
    return (
      <HorizontalFlexWrapper>
        <Typography variant="body-regular">{recAction.impactedServices}</Typography>
      </HorizontalFlexWrapper>
    );
  }
};

export const actionCategoryColumn: ColumnDefinition<RecommendedAction> = {
  label: t('in-automation:actionCategory'),
  id: 'tag',
  width: 10,
  getContent(recAction) {
    return <DynamicTagList tags={[turboActionCategoryMap[recAction.actionCategory]]} />;
  }
};
