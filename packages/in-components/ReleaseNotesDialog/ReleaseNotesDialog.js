import React from 'react';

import { markAsRead, unreadReleaseNotesContentAndVersion$ } from 'in-stores/releaseNotes';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import NotificationDialog from 'in-components/NotificationDialog';
import { toHtml } from 'in-services/formatters/markdown';
import connectTo from 'in-hoc/connectTo';

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
      <NotificationDialog onClose={() => markAsRead(releaseNotes.version)} title="Release Notes">
        <DangerousHtmlPresenter className={block} html={toHtml(releaseNotes.content)} />
      </NotificationDialog>
    );
  }
);
