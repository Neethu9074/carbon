/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getResourceTypesComboBoxItems } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import ComboBox from 'in-components/ComboBox';

import locals from './Filters.mless';

export default function Filters({ resourceType, setFilter }) {
  return (
    <ComboBox
      value={resourceType}
      onChange={t => setFilter({ resourceType: t ? t.value : null })}
      placeholder="Type…"
      options={getResourceTypesComboBoxItems()}
      className={locals.filter}
    />
  );
}
