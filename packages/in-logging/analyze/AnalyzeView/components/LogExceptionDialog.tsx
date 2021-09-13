/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import { logLevelColumn, timestampColumn, copyColumn } from 'in-logging/analyze/AnalyzeView/components/logsColumns';
import LogMessageColumnReadOnly from 'in-logging/analyze/AnalyzeView/components/LogMessageColumnReadOnly';
// @ts-expect-error
import Dialog from 'in-components/Dialog/Dialog';
import { close } from 'in-components/DialogPresenter/store';
import { LogItem } from 'in-types';
import { t } from 'in-i18n';

// @ts-expect-error
import locals from './LogExceptionDialog.mless';

interface LogExceptionDialogProps {
  item: LogItem;
  onClose: () => void;
}

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumnReadOnly
  },
  copyColumn
];

export default function LogExceptionDialog({ item, onClose = close }: LogExceptionDialogProps) {
  return (
    <Dialog
      className={locals.dialog}
      titleIconType="lib_document"
      title={t('in-logging:exceptionMessageHeader')}
      onClose={onClose}
    >
      <Ul space="disabled">
        <Li className={locals.listItem} size="compact">
          <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
        </Li>
      </Ul>
    </Dialog>
  );
}
