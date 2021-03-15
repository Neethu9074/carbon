/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import { t } from 'in-i18n';

export default function MoreBarItem({ onClick, label = t('in-analyze:filterBar.allFilters') }) {
  return (
    <BarItem onClick={onClick} showMore>
      {label}
    </BarItem>
  );
}
