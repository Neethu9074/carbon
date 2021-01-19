/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';

import locals from './HelpDialog.mless';

export default function HelpDialog({ article }) {
  if (!article) return null;

  return (
    <Dialog title={article.meta.title} onClose={close}>
      <DangerousHtmlPresenter className={locals.dialog} html={article.html} />
    </Dialog>
  );
}

HelpDialog.propTypes = {
  article: rpt.shape({
    meta: rpt.object.isRequired,
    html: rpt.string.isRequired
  })
};
