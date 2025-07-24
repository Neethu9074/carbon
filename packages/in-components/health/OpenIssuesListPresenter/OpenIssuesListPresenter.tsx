/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

import { Result, Event } from '@instana/types';

import Actions from 'in-components/health/OpenIssuesListPresenter/internal/Actions';
import Header from 'in-components/health/OpenIssuesListPresenter/internal/Header';
import Issues from 'in-components/health/OpenIssuesListPresenter/internal/Issues';
import { compare } from 'in-services/util/number';
import { mapData } from 'in-services/util/result';

import locals from './OpenIssuesListPresenter.mless';

const maxIssuesToShow = 10;

export type OpenIssuesResult = Result<Event[]>;

export interface OpenIssuesListPresenterProps {
  openIssuesResult: OpenIssuesResult;
  analyzeLink?: string;
  getIssueLink?: (issueId: string) => string;
  close?: () => void;
  eventType?: string;
  inContentArea?: boolean;
}

/**
 * Renders the list of issues, that is typically derived from any EntityHealthInfo, after modification.
 *
 * In parent functions this usually fetches the info like in
 * ```
 *     const openIssuesResult = useObservabled(getMobileHealthInfo({
 *         mobileAppId, //...
 *       })
 *         .startWith(indeterminateProgress)
 *         .map(result => mapData(result, data => data.openIssues)) // reduce to its openIssues field
 *     );
 * ```
 *
 */
export default function OpenIssuesListPresenter({
  openIssuesResult,
  analyzeLink,
  getIssueLink,
  close,
  eventType = 'Issue',
  inContentArea
}: OpenIssuesListPresenterProps): ReactElement {
  openIssuesResult = mapData<Event[], Event[]>(openIssuesResult, openIssues =>
    openIssues ? openIssues.slice().sort((a, b) => compare(b.problem?.severity, a.problem?.severity)) : []
  );

  return (
    <div className={locals.list}>
      {inContentArea && (
        <Header
          openIssuesResult={openIssuesResult}
          maxIssuesToShow={maxIssuesToShow}
          close={close}
          eventType={eventType}
        />
      )}
      <div className={locals.container}>
        <Issues openIssuesResult={openIssuesResult} maxIssuesToShow={maxIssuesToShow} getIssueLink={getIssueLink} />
        <Actions
          openIssuesResult={openIssuesResult}
          maxIssuesToShow={maxIssuesToShow}
          analyzeLink={analyzeLink}
          getIssueLink={getIssueLink}
          eventType={eventType}
        />
      </div>
    </div>
  );
}
