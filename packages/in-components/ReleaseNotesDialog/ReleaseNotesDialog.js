/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonModal } from '@instana/components';

import { markAsRead, unreadReleaseNotesContentAndVersion$, getReleaseNotesState } from 'in-stores/releaseNotes';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
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

    // Get the state so we know if the modal should be displayed or not
    const showNotes = getReleaseNotesState() === 'show again';

    return (
      <CarbonModal
        open={showNotes}
        modalHeading={t('in-components:releaseNotesDialog.releaseNotesTitle')}
        onClose={() => {
          markAsRead('releaseNotes.version');
        }}
        onRequestClose={() => {
          markAsRead('releaseNotes.version');
        }}
        passiveModal
      >
        <DangerousHtmlPresenter className={block} html={toHtml(releaseNotes.content)} />
      </CarbonModal>
    );
  }
);
