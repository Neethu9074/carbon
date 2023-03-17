/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from 'in-i18n';

export const processColumnDefinitions = [
  {
    id: 'process_id',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.idLabel'),
    getContent() {
      return <div />;
    }
  },
  {
    id: 'activity_count',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.activityLabel'),
    getContent() {
      return <div />;
    }
  },
  {
    id: 'process_tool',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.toolLabel'),
    getContent() {
      return <div />;
    }
  }
];
