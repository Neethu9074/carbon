import React from 'react';

import { markAsRead, releaseNotes$ } from 'in-stores/releaseNotes';
import { toHtml } from 'in-services/formatters/markdown';
import NotificationDialog from 'in-components/NotificationDialog';
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
        <div dangerouslySetInnerHTML={{ __html: toHtml(releaseNotes) }} className={block} />
      </NotificationDialog>
    );
  }
);
