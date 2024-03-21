/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer, Toggle } from '@instana/components';

import { t } from 'in-i18n';

import locals from './HighlightSwitch.mless';

export default function HighlightSwitch(props) {
  const { showHealth, setShowHealth } = props;

  return (
    <div className={locals.wrapper}>
      <span className={locals.label}>{t('in-kubernetes:dashboards.highlightUnhealthy')}</span>
      <Spacer horizontal="xxsmall" />
      <Toggle checked={showHealth} onToggle={e => setShowHealth(e)} />
    </div>
  );
}
