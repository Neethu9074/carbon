/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Toggle, Spacer } from '@instana/components';

import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';

import './SavingToggle.less';

const block = 'in-table-saving-toggle';

export default function SavingToggle({ onChange, checked, status }) {
  return (
    <div className={`${block}__flex-wrapper`}>
      <Toggle className={`${block}__toggle`} checked={checked} onChange={e => onChange(e.target.checked)} />
      <Spacer horizontal="xxsmall" />
      {status ? <ModificationSaveStatus status={status} className={`${block}__save-status`} reserveSpace /> : null}
    </div>
  );
}
