import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { markAsRead, releaseNotes$ } from 'in-stores/releaseNotes';
import NotificationDialog from 'in-components/NotificationDialog';
import { toHtml } from 'in-services/formatters/markdown';
import connectTo from 'in-hoc/connectTo';

import './ReleaseNotesDialog.less';

const block = 'in-release-notes-dialog';

export default connectTo(
  {
    releaseNotes: releaseNotes$
  },
  function ReleaseNotesDialog({ releaseNotes }) {
    if (!releaseNotes) {
      return null;
    }

    return (
      <NotificationDialog onClose={markAsRead} title="Release Notes">
        <DangerousHtmlPresenter className={block} html={toHtml(releaseNotes)} />
      </NotificationDialog>
    );
  }
);
