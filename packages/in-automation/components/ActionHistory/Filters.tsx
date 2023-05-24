/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { FilterSectionProps } from 'in-automation/components/ActionHistory/constants';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Filters.mless';

export default function Filters({ setFilter, actionTypes, actionStatuses }: FilterSectionProps) {
  return (
    <Fragment>
      <ComboBox
        value={actionTypes}
        onChange={t => Array.isArray(t) && setFilter({ actionTypes: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.testList.type')}
        isMulti
        options={[
          { label: t('in-automation:ActionCatalog.http'), value: 'HTTP' },
          { label: t('in-automation:ActionCatalog.script'), value: 'SCRIPT' },
          { label: t('in-automation:actionHistory.external'), value: 'EXTERNAL' }
        ]}
        className={locals.filter}
      />
      <ComboBox
        value={actionStatuses}
        onChange={t => Array.isArray(t) && setFilter({ actionStatuses: t.map(a => a.value) })}
        placeholder="Status"
        isMulti
        options={[
          { label: t('in-automation:actionHistory.success'), value: 'SUCCESS' },
          { label: t('in-automation:actionHistory.failed'), value: 'FAILED' },
          { label: t('in-automation:actionHistory.inProgress'), value: 'IN_PROGRESS' }
        ]}
        className={locals.filter}
      />
    </Fragment>
  );
}
