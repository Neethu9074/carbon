/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Layer } from '@instana/carbon';
import { TableSkeleton, Message } from '@instana/components';
import { Event, Result } from '@instana/types';

import { scoredActionAiEngineColumn, scoredActionNameColumn } from 'in-automation/ActionTable/columnDefinitions';
import { RecActionsMoreMenu } from 'in-automation/AutomationCard/RecommendedActions';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { TableProps } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

import locals from './ActionHistory.mless';

interface TopThreeActionsProps {
  triggeringEvent?: Event;
  trigger: Result<TriggerSpecification>;
  recommendedActions?: Result<ScoredAction[]>;
  firstThreeActions: ScoredAction[];
}

function Loading() {
  return (
    <div>
      <div className={locals.title}>{t('in-events:notes.recommendedActions')}</div>
      <TableSkeleton compact />
      <Button className={locals.viewAll} kind="ghost" disabled size="sm">
        {t('in-events:notes.viewAllRecActions')}
      </Button>
    </div>
  );
}

export function TopThreeActions({
  triggeringEvent,
  trigger,
  recommendedActions,
  firstThreeActions
}: TopThreeActionsProps) {
  if (recommendedActions?.errors && recommendedActions.errors.length > 0) {
    return (
      <>
        <div className={locals.title}>{t('in-events:notes.recommendedActions')}</div>
        {recommendedActions.errors.map(err => (
          <Message subtitle={err.code} type="error">
            {err.message}
          </Message>
        ))}
      </>
    );
  }
  const isLoading = recommendedActions?.progress?.loading;
  if (isLoading) {
    return <Loading />;
  }
  if (!triggeringEvent) {
    return <Loading />;
  }
  const tableProps: TableProps<ScoredAction> = { columnDefinitions: [], orderBy: '', orderDirection: 'DESC' };
  const nameColumn = (action: ScoredAction) => scoredActionNameColumn.getContent(action, tableProps, '');
  const aiEngColumn = (action: ScoredAction) => scoredActionAiEngineColumn.getContent(action, tableProps, '');
  return (
    <div>
      <div className={locals.title}>{t('in-events:notes.recommendedActions')}</div>
      {firstThreeActions.length > 0 && (
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
              {firstThreeActions.map(i => (
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
      <Button
        className={locals.viewAll}
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
  );
}
