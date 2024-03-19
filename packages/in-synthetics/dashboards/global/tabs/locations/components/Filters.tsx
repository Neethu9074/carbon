/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { t } from '@instana/i18n-react';

import ComboBox from 'in-components/ComboBox';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/Filters.mless';

type Option = {
  label: string;
  value: string;
};

const locationTypeLabelOptions: Option[] = [
  {
    label: 'Private',
    value: 'Private'
  },
  {
    label: 'Managed',
    value: 'Managed'
  }
];

interface FilterProps {
  setFilter: (x: Object) => void;
  locationTypes: string[];
}
export default function Filters({ setFilter, locationTypes }: FilterProps) {
  return (
    <Fragment>
      <ComboBox
        value={locationTypes}
        onChange={t => Array.isArray(t) && setFilter({ locationTypes: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.locationList.type')}
        isMulti
        options={locationTypeLabelOptions}
        className={locals.filter}
      />
    </Fragment>
  );
}
