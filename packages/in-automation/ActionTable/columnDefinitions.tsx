/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';
import { Action } from '@instana/types';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getType, isExternal } from 'in-automation/ActionCatalog/shared';
import WithSubscript from 'in-settings/components/WithSubscript';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { ScoredAction } from 'in-automation/api';
import { t } from 'in-i18n';

export const actionNameColumn: ColumnDefinition<Action | ScoredAction> = {
  id: 'actionName',
  label: t('in-automation:policies.actionName'),
  getContent(action) {
    const description = action.description ?? action.name;
    const name = isExternal(action.type) ? description : action.name;
    return (
      <Tooltip content={name} align="topLeft" delay={500}>
        <WithSubscript subscript={getType(action.type)}>
          <Typography noWrap variant="body-regular">
            {name}
          </Typography>
        </WithSubscript>
      </Tooltip>
    );
  },
  width: 23,
  sortable: true
};

export const aiEngineColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:aiEngine'),
  id: 'engine',
  width: 15,
  getContent(action) {
    return (
      <Typography variant="body-regular">
        {action.aiEngine.startsWith('A similar event') ? t('in-automation:eventSimilarity') : action.aiEngine}
      </Typography>
    );
  }
};

export const scoreColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:ActionCatalog.aiScore'),
  id: 'confidence',
  width: 10,
  sortable: true,
  getContent(action) {
    if (isExternal(action.type)) return null;
    return (
      <Tooltip
        content={t('in-automation:ActionCatalog.confidenceHelpText', { source: action.aiEngine })}
        align="topRight"
        delay={500}
      >
        <HorizontalFlexWrapper>
          <Typography variant="body-regular">
            {t('in-automation:ActionCatalog.confidence', { context: action.confidence })}
          </Typography>
        </HorizontalFlexWrapper>
      </Tooltip>
    );
  }
};
