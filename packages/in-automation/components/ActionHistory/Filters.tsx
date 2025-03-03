/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { FilterSectionProps } from 'in-automation/components/ActionHistory/constants';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

export default function Filters({ setFilter, types, actionStatuses }: FilterSectionProps) {
  return (
    <>
      <TypeFilter
        type={types ?? undefined}
        showExternal
        setType={params => setFilter({ types: params.types })}
        showRunnable
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
          { label: t('in-automation:actionHistory.inProgress'), value: 'IN_PROGRESS' },
          { label: t('in-automation:actionHistory.submitted'), value: 'SUBMITTED' },
          { label: t('in-automation:actionHistory.timeout'), value: 'TIMEOUT' },
          { label: t('in-automation:actionHistory.unknown'), value: 'STATUS_UNKNOWN' }
        ]}
      />
      <Spacer horizontal="small" />
    </>
  );
}
