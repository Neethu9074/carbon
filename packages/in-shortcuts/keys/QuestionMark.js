/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { addActiveDialog } from 'in-components/DialogPresenter/store';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import { t } from 'in-i18n';

export default function onPressed() {
  addActiveDialog(
    <HelpDialog title={t('in-services:shortcuts.shortcuts')} markdownContent={t('in-services:shortcuts.help')} />
  );
}
