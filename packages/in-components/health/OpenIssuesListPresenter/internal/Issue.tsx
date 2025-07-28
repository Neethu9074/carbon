/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ContainedListItem, Tag, Stack } from '@instana/carbon';
import { SvgIcon, Typography } from '@instana/components';
import { Event } from '@instana/types';

import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { formatDateTime } from 'in-services/formatters/date';
import { issueClickTracker } from 'in-components/tracker';
import { toHtml } from 'in-services/formatters/markdown';
import { t } from 'in-i18n';

import locals from './Issue.mless';

const MAX_PROBLEM_TEXT_LENGTH = 1000;

interface IssueProps {
  issue: Event;
  getIssueLink?: (issueId: string) => string;
}

/**
 * Renders the fix suggestion content based on its length
 */
function renderFixSuggestion(fixSuggestion: string | undefined): React.ReactNode {
  if (!fixSuggestion) {
    return null;
  }

  if (fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH) {
    return (
      <div className={locals.descriptionTooLong}>
        <Typography variant="helper-text-01">
          {t('in-components:health.openIssuesListPresenterIssueDescriptionOmitted')}
        </Typography>
      </div>
    );
  }

  return <DangerousHtmlPresenter html={toHtml(fixSuggestion)} className={locals.fixSuggestion} />;
}

export default function Issue({ issue, getIssueLink }: IssueProps): React.ReactElement {
  const severity = issue.problem?.severity ?? 0; // or -1 if not set?
  const color = getDesignLibraryColorBySeverity(severity);
  const type = getDesignLibrarySeverityIcon(severity);

  const issueHref = getIssueLink ? getIssueLink(issue.id) : '';
  const onClick = () => {
    issueClickTracker({ path: issueHref });
    window.location.href = issueHref;
  };

  return (
    <ContainedListItem
      onClick={getIssueLink ? onClick : undefined}
      className={locals.issue}
      renderIcon={() => {
        return (
          <SvgIcon
            type={type}
            color={color}
            size="xs"
            className={classNames({
              [locals.icon]: true,
              [locals.iconWarning]: severity <= 5 && severity !== 0
            })}
          />
        );
      }}
    >
      <Stack gap={3}>
        <div>
          <Tag type="gray" size="sm" className={locals.tag} id={`tag-${issue.id}`}>
            {t('in-components:health.openIssuesListPresenterStarted')}
          </Tag>
          <Typography variant="label-01">{formatDateTime(issue.start)}</Typography>
        </div>
        <Stack gap={1}>
          <div>
            <div>
              <Typography variant="body-compact-01">{issue.problem?.problemText}</Typography>
            </div>
          </div>
          <div>
            <div>{renderFixSuggestion(issue.problem?.fixSuggestion)}</div>
          </div>
        </Stack>
      </Stack>
    </ContainedListItem>
  );
}
