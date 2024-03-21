/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Spacer, Toggle } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './FastQueryModeToggle.mless';

export default function FastQueryModeToggle({ fastQueryModeEnabled, onChangeFastQueryModeEnabled }) {
  return (
    <div className={locals.preview}>
      <Tooltip content={t('in-applications:analyze.fastQueryModeTooltip')} delay={500}>
        <span>{t('in-applications:analyze.fastQueryMode')}</span>
      </Tooltip>

      <Spacer horizontal="xxsmall" />

      <Toggle checked={fastQueryModeEnabled} onToggle={onChangeFastQueryModeEnabled} />
    </div>
  );
}
