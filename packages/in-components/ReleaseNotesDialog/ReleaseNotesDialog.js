/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { markAsRead, unreadReleaseNotesContentAndVersion$ } from 'in-stores/releaseNotes';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import Dialog from 'in-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './ReleaseNotesDialog.less';

const block = 'in-release-notes-dialog';

export default connectTo(
  {
    releaseNotes: unreadReleaseNotesContentAndVersion$
  },
  function ReleaseNotesDialog({ releaseNotes }) {
    if (!releaseNotes || !releaseNotes.content) {
      return null;
    }

    return (
      <Dialog
        onClose={() => markAsRead(releaseNotes.version)}
        title={t('in-components:releaseNotesDialog.releaseNotesTitle')}
      >
        <DangerousHtmlPresenter className={block} html={toHtml(releaseNotes.content)} />
      </Dialog>
    );
  }
);
