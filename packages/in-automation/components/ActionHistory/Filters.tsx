/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { FilterSectionProps } from 'in-automation/components/ActionHistory/constants';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

export default function Filters({ setFilter, actionTypes, actionStatuses }: FilterSectionProps) {
  return (
    <>
      <ComboBox
        value={actionTypes}
        onChange={t => Array.isArray(t) && setFilter({ actionTypes: t.map(a => a.value) })}
        placeholder={t('in-automation:actionHistory.type')}
        isMulti
        options={[
          { label: t('in-automation:ActionCatalog.http'), value: 'HTTP' },
          { label: t('in-automation:ActionCatalog.script'), value: 'SCRIPT' },
          { label: t('in-automation:actionHistory.external'), value: 'EXTERNAL' }
        ]}
      />
      <Spacer horizontal="small" />
      <ComboBox
        value={actionStatuses}
        onChange={t => Array.isArray(t) && setFilter({ actionStatuses: t.map(a => a.value) })}
        placeholder={t('in-automation:actionHistory.status')}
        isMulti
        options={[
          { label: t('in-automation:actionHistory.success'), value: 'SUCCESS' },
          { label: t('in-automation:actionHistory.failed'), value: 'FAILED' },
          { label: t('in-automation:actionHistory.inProgress'), value: 'IN_PROGRESS' }
        ]}
      />
      <Spacer horizontal="small" />
    </>
  );
}
