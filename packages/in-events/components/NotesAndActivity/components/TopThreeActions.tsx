/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Layer } from '@instana/carbon';
import { TableSkeleton } from '@instana/components';
import { Event } from '@instana/types';

import useScoredActions, { useUserRecommendedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { scoredActionAiEngineColumn, scoredActionNameColumn } from 'in-automation/ActionTable/columnDefinitions';
import { RecActionsMoreMenu } from 'in-automation/AutomationCard/RecommendedActions';
import { TableProps } from 'in-components/tables/ServerTable/types';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { ScoredAction } from 'in-automation/types';
import { t } from 'in-i18n';

import locals from './ActionHistory.mless';

interface TopThreeActionsProps {
  event?: Event;
  triggeringEvent?: Event;
}

export function TopThreeActions({ event, triggeringEvent }: TopThreeActionsProps) {
  if (!event) {
    return null;
  }
  if (!triggeringEvent) {
    return null;
  }
  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions });
  const isLoading = recommendedActions?.progress?.loading;
  const firstThreeIfPresent = (recommendedActions?.data || []).slice(0, 3);
  const tableProps: TableProps<ScoredAction> = { columnDefinitions: [], orderBy: '', orderDirection: 'DESC' };
  const nameColumn = (action: ScoredAction) => scoredActionNameColumn.getContent(action, tableProps, '');
  const aiEngColumn = (action: ScoredAction) => scoredActionAiEngineColumn.getContent(action, tableProps, '');
  return (
    <div>
      <div className={locals.title}>{t('in-events:notes.recommendedActions')}</div>
      {isLoading && <TableSkeleton compact />}
      {firstThreeIfPresent.length > 0 && (
        <Layer>
          <Table size="sm" className={locals.actionTable}>
            <TableHead>
              <TableRow>
                <TableHeader>{t('in-automation:actionHistory.name')}</TableHeader>
                <TableHeader>{t('in-events:notes.aiEngine')}</TableHeader>
                <TableHeader>{t('in-automation:ActionCatalog.confidenceTitle')}</TableHeader>
                <TableHeader>{/*No label*/}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {firstThreeIfPresent.map(i => (
                <TableRow>
                  <TableCell className={locals.actionTitle}>{nameColumn(i)}</TableCell>
                  <TableCell>{aiEngColumn(i)}</TableCell>
                  <TableCell>{t('in-automation:ActionCatalog.confidence', { context: i.confidence })}</TableCell>
                  <TableCell>
                    <RecActionsMoreMenu scoredAction={i} volatileId={{}} event={triggeringEvent} trigger={trigger} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Layer>
      )}
      <div className={locals.viewAll}>
        <Button
          kind="ghost"
          size="sm"
          onClick={() => {
            window.scrollBy({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }}
        >
          {t('in-events:notes.viewAllRecActions')}
        </Button>
      </div>
    </div>
  );
}
