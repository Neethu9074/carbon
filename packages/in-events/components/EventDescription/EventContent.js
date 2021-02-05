/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import SnapshotDescription from 'in-components/SnapshotDescription';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { toHtml } from 'in-services/formatters/markdown';

const MAX_PROBLEM_TEXT_LENGTH = 1000;
const block = 'in-event-description';

export default function EventContent({ showFullTextIfToLong, snapshotId, event, color }) {
  let fixSuggestion = event.getIn(['problem', 'fixSuggestion']) || '';
  fixSuggestion =
    !showFullTextIfToLong && fixSuggestion.length > MAX_PROBLEM_TEXT_LENGTH
      ? t('in-events:furtherFixSuggestion')
      : toHtml(fixSuggestion);

  return (
    <div>
      <div className={`${block}__header`} style={{ color }}>
        {event.getIn(['problem', 'problemText'])}
      </div>

      <DangerousHtmlPresenter className={`${block}__suggestion`} html={fixSuggestion} />
      {snapshotId && (
        <SnapshotDescription snapshotId={snapshotId} timeConfig={getTimeConfigAtMoment(event.get('start'))} />
      )}
    </div>
  );
}
