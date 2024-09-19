/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Link } from '@instana/components';
import { formatDateTime } from '@instana/format-date';
import { Action } from '@instana/types';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getType, isExternal } from 'in-automation/ActionCatalog/shared';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import WithSubscript from 'in-settings/components/WithSubscript';
import { viewTurboActionTracker } from 'in-automation/tracker';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { ScoredAction } from 'in-automation/api';
import { t } from 'in-i18n';

const mockdata = true;
const mockTypes = ['Resize', 'Delete', 'Scale', 'Buy', 'Move'];

export const nameColumn: ColumnDefinition<Action | ScoredAction> = {
  id: 'name',
  label: t('in-automation:name'),
  ellipsis: true,
  getContent(action) {
    const description = action.description ?? action.name;
    const name = isExternal(action.type) ? description : action.name;
    return (
      <Tooltip content={name} align="auto" delay={500} overwriteBlock caret={false}>
        {isExternal(action.type) ? (
          <Link ellipsis href={action.name} external onClick={() => handleTurboTracking(name)}>
            <span>{name}</span>
          </Link>
        ) : (
          <WithSubscript subscript={getType(action.type)}>
            <Typography noWrap variant="body-regular">
              {name}
            </Typography>
          </WithSubscript>
        )}
      </Tooltip>
    );
  },
  width: 25,
  sortable: true
};

export const descriptionColumn: ColumnDefinition<Action | ScoredAction> = {
  label: t('in-automation:description'),
  id: 'description',
  width: 25,
  getContent(action) {
    return (
      <FourLineWrapper>
        <Typography variant="body-regular">{action.description}</Typography>
      </FourLineWrapper>
    );
  }
};

export const actionCategoryColumn: ColumnDefinition<{ tags: string[] }> = {
  label: t('in-automation:actionCategory'),
  id: 'tags',
  width: 10,
  getContent(item) {
    const { tags = [] } = item;
    return <DynamicTagList tags={mockdata ? ['Performance'] : tags} />;
  }
};

export const typesColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:types'),
  id: 'engine',
  width: 10,
  getContent(action) {
    return (
      <Typography variant="body-regular">
        {mockdata
          ? mockTypes[Math.floor(Math.random() * mockTypes.length)]
          : action.aiEngine.startsWith('A similar event')
          ? t('in-automation:eventSimilarity')
          : action.aiEngine}
      </Typography>
    );
  }
};

export const impactedServicesColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:impactedServices'),
  id: 'score',
  width: 10,
  sortable: true,
  getContent(action) {
    if (isExternal(action.type)) return null;
    return (
      <HorizontalFlexWrapper>
        <Typography variant="body-regular">
          {mockdata
            ? Math.floor(Math.random() * 500)
            : t('in-automation:ActionCatalog.confidence', { context: action.confidence })}
        </Typography>
      </HorizontalFlexWrapper>
    );
  }
};

export const lastModifiedColumn: ColumnDefinition<Action> = {
  label: t('in-automation:ActionCatalog.lastModified'),
  id: 'modifiedAt',
  width: 15,
  getContent(action) {
    return <Typography variant="body-regular">{formatDateTime(+action.modifiedAt * 1000)}</Typography>;
  }
};

export const handleTurboTracking = (name: string) => {
  viewTurboActionTracker({
    actionName: name,
    actionType: 'Turbonomic',
    page: 'Recommended actions'
  });
};
