/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonToggle } from '@instana/components';

import { t } from 'in-i18n';

import locals from './HighlightSwitch.mless';

export default function HighlightSwitch(props) {
  const { showHealth, setShowHealth } = props;

  return (
    <div className={locals.wrapper}>
      <CarbonToggle
        id="highlight-unhealthy"
        size="sm"
        hideLabel
        toggled={showHealth}
        labelText={t('in-kubernetes:dashboards.highlightUnhealthy')}
        onToggle={e => setShowHealth(e)}
      />
    </div>
  );
}
