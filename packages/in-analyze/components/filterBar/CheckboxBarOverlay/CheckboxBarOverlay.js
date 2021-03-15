/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

import locals from './CheckboxBarOverlay.mless';

export default function CheckboxOverlay({
  tag,
  existingSyntheticFilter,
  existingInternalFilter,
  onChangeSynthetic,
  onChangeHidden
}) {
  return (
    <BarOverlay>
      <div className={locals.wrapper}>
        <CheckboxFancy
          label={t('in-analyze:filterBar.checkboxBarOverlay.labelSynthetic')}
          checked={!!existingSyntheticFilter}
          onChange={() => onChangeSynthetic(tag.synthetic)}
          size="large"
        />
        <CheckboxFancy
          label={t('in-analyze:filterBar.checkboxBarOverlay.labelInternal')}
          checked={!!existingInternalFilter}
          onChange={() => onChangeHidden(tag.internal)}
          size="large"
        />
      </div>
    </BarOverlay>
  );
}
