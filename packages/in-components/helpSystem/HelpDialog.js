/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { close } from 'in-components/DialogPresenter/store';
import { toHtml } from 'in-services/formatters/markdown';
import Dialog from 'in-components/Dialog/Dialog';

import locals from './HelpDialog.mless';

export default function HelpDialog({ title, markdownContent }) {
  return (
    <Dialog title={title} onClose={close}>
      <DangerousHtmlPresenter className={locals.dialog} html={toHtml(markdownContent)} />
    </Dialog>
  );
}

HelpDialog.propTypes = {
  title: rpt.string.isRequired,
  markdownContent: rpt.string.isRequired
};
