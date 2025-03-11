/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Typography } from '@instana/components';
import { formatDateTime } from '@instana/format-date';
import { Action } from '@instana/types';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { ACTION_TRANSLATIONS, ACTION_TYPE } from 'in-automation/constants';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import WithSubscript from 'in-settings/components/WithSubscript';
import { actionCatalog } from 'in-automation/navigation/paths';
import { useSegmentTracker } from 'in-automation/tracker';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { ScoredAction } from 'in-automation/types';
import { t } from 'in-i18n';

import locals from 'in-automation/ActionTable/columnDefinitions.mless';

function NameColumn({ action }: { action: Action | ScoredAction }) {
  const { name, id, type } = action;
  const hrefToActionDashboard = useHrefToActionDashboard();
  const { viewAIGenaratedActionTrackerSegment } = useSegmentTracker();
  const { location } = useNavigation();
  const isAIActions = location.matrix[actionCatalog]?.view && location.matrix[actionCatalog]?.view === 'ai';
  return (
    <WithSubscript subscript={ACTION_TRANSLATIONS[type]}>
      <Link
        className={locals.ellipsis}
        href={hrefToActionDashboard(id)}
        onClick={() => {
          if (isAIActions) {
            viewAIGenaratedActionTrackerSegment({ actionName: name, actionType: type });
          }
        }}
      >
        {name}
      </Link>
    </WithSubscript>
  );
}

export const nameColumn: ColumnDefinition<Action | ScoredAction> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: action => <NameColumn action={action} />,
  width: 15,
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
export const aiEngineColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:aiEngine'),
  id: 'engine',
  width: 8,
  getContent(action) {
    return (
      <Typography variant="body-regular">
        {action.aiEngine.startsWith('A similar event') ? t('in-automation:eventSimilarity') : action.aiEngine}
      </Typography>
    );
  }
};

export const scoreColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:ActionCatalog.confidenceTitle'),
  id: 'score',
  width: 8,
  sortable: true,
  getContent(action) {
    if (action.type === ACTION_TYPE.EXTERNAL) return null;
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

export const lastModifiedColumn: ColumnDefinition<Action> = {
  label: t('in-automation:ActionCatalog.lastModified'),
  id: 'modifiedAt',
  width: 15,
  getContent(action) {
    return <Typography variant="body-regular">{formatDateTime(+action.modifiedAt * 1000)}</Typography>;
  }
};
