/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, Typography } from '@instana/components';
import { formatDateTime } from '@instana/format-date';
import { Action, Policy } from '@instana/types';

import { ACTION_TYPE, ACTION_TRANSLATIONS, ScoredActionsType, ScoredActionsAIEngine } from 'in-automation/constants';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { isManual, isAutomatic, getActionConfigurationFromPolicy } from 'in-automation/utils/policy';
import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import useHrefToPolicyDetails from 'in-automation/navigation/hooks/useHrefToPolicyDetails';
import FourLineWrapper from 'in-automation/components/FourLineWrapper/FourLineWrapper';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import WithSubscript from 'in-settings/components/WithSubscript';
import { actionCatalog } from 'in-automation/navigation/paths';
import { useSegmentTracker } from 'in-automation/tracker';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { ScoredAction } from 'in-automation/types';
import { t } from 'in-i18n';

import locals from 'in-automation/ActionTable/columnDefinitions.mless';

export function NameColumn({ action, isLink = true }: { action: Action; isLink?: boolean }) {
  const { name, id, type } = action;
  const hrefToActionDashboard = useHrefToActionDashboard();
  const { viewAIGenaratedActionTrackerSegment } = useSegmentTracker();
  const { location } = useNavigation();
  const isAIActions = location.matrix[actionCatalog]?.view && location.matrix[actionCatalog]?.view === 'ai';
  return (
    <WithSubscript subscript={ACTION_TRANSLATIONS[type]}>
      {isLink ? (
        <Link
          className={locals.ellipsis}
          // @ts-ignore-error ignore added for turbo url
          href={type !== ACTION_TYPE.EXTERNAL ? hrefToActionDashboard(id) : action.metadata?.ai[0]?.actionDetailsURL}
          onClick={() => {
            if (isAIActions) {
              viewAIGenaratedActionTrackerSegment({ actionName: name, actionType: type });
            }
          }}
        >
          {name}
        </Link>
      ) : (
        <span title={name} className={locals.ellipsis}>
          {name}
        </span>
      )}
    </WithSubscript>
  );
}

export const nameColumn: ColumnDefinition<Action> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: action => <NameColumn action={action} />,
  width: 15,
  sortable: true
};

export const descriptionColumn: ColumnDefinition<Action> = {
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

export const scoredActionScoreColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:ActionCatalog.confidenceTitle'),
  id: 'score',
  width: 4,
  sortable: true,
  getContent(scoredAction) {
    const action = scoredAction.entity as Action;
    if (action.type === ACTION_TYPE.EXTERNAL) return null;
    return (
      <HorizontalFlexWrapper>
        <Typography variant="body-regular">
          {t('in-automation:ActionCatalog.confidence', { context: scoredAction.confidence })}
        </Typography>
      </HorizontalFlexWrapper>
    );
  }
};

function ScoredActionNameColumn({ scoredAction }: { scoredAction: ScoredAction }) {
  const action = scoredAction.entity as Action;
  const policy = scoredAction.entity as Policy;
  const hrefToActionDashboard = useHrefToActionDashboard();
  const hrefToPolicyDetails = useHrefToPolicyDetails();
  const { viewAIGenaratedActionTrackerSegment } = useSegmentTracker();
  const { location } = useNavigation();
  const isAIActions = location.matrix[actionCatalog]?.view && location.matrix[actionCatalog]?.view === 'ai';
  if (scoredAction.aiEngine !== 'POLICY' && action !== undefined) {
    const { name, id, type } = action;
    return (
      <WithSubscript subscript={ACTION_TRANSLATIONS[type]}>
        <Link
          className={locals.ellipsis}
          // @ts-ignore-error ignore added for turbo url
          href={type !== ACTION_TYPE.EXTERNAL ? hrefToActionDashboard(id) : action.metadata?.ai[0]?.actionDetailsURL}
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
  } else if (scoredAction.aiEngine === 'POLICY' && policy !== undefined) {
    const action = getActionConfigurationFromPolicy(policy).action;
    return (
      <Tooltip content={action.name} align="topLeft" delay={500} overwriteBlock>
        <WithSubscript
          subscript={
            <Typography noWrap variant="body-small">
              {`${ACTION_TRANSLATIONS[action.type] || 'Unknown'}: ${PolicyType(policy) || 'N/A'}`}
            </Typography>
          }
        >
          <Link
            className={locals.ellipsis}
            href={hrefToPolicyDetails(policy.id)}
            onClick={() => {
              if (isAIActions) {
                viewAIGenaratedActionTrackerSegment({ actionName: action.name, actionType: action.type });
              }
            }}
          >
            {policy.name}
          </Link>
        </WithSubscript>
      </Tooltip>
    );
  } else {
    return null;
  }
}

function PolicyType(policy: Policy) {
  if (isManual(policy) && isAutomatic(policy)) {
    return t('in-automation:policies.manualAutomatic');
  }
  if (isManual(policy)) {
    return t('in-automation:policies.manual');
  }
  if (isAutomatic(policy)) {
    return t('in-automation:policies.automatic');
  }
  return null;
}

export const scoredActionNameColumn: ColumnDefinition<ScoredAction> = {
  id: 'name',
  label: t('in-automation:name'),
  getContent: action => <ScoredActionNameColumn scoredAction={action} />,
  width: 30,
  sortable: true
};

export const scoredActionDescriptionColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:description'),
  id: 'description',
  width: 20,
  getContent(action) {
    return (
      <FourLineWrapper>
        <Typography variant="body-regular">{action.entity?.description}</Typography>
      </FourLineWrapper>
    );
  }
};

export const scoredActionTagsColumn: ColumnDefinition<ScoredAction> = {
  label: t('in-automation:tags'),
  id: 'tags',
  width: 10,
  getContent(item) {
    const { tags = [] } = item.entity!;
    return <DynamicTagList tags={tags} />;
  }
};

export const scoredActionAiEngineColumn: ColumnDefinition<ScoredAction> = {
  label: 'Type',
  id: 'engine',
  width: 8,
  getContent(action) {
    return (
      <WithSubscript
        subscript={
          <Typography noWrap variant="body-small">
            {ScoredActionsAIEngine[action.aiEngine]}
          </Typography>
        }
      >
        <Typography noWrap variant="body-regular">
          {ScoredActionsType[action.aiEngine]}
        </Typography>
      </WithSubscript>
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
