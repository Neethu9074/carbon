/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import Toggle from 'react-toggle';
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { t } from 'in-i18n';

import locals from './PreviewToggle.mless';

export default function PreviewToggle({ previewEnabled, onChangePreviewEnabled }) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;

  if (!internalVisible) {
    return null;
  }

  return (
    <div className={locals.preview}>
      <span>{t('in-applications:analyze.preview')}</span>
      <Toggle checked={previewEnabled} onChange={e => onChangePreviewEnabled(e.target.checked)} />
    </div>
  );
}
