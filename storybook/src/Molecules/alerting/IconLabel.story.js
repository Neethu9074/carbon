/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import IconLabel from 'in-alerting/components/IconLabel';

export default {
  title: 'Molecules|alerting/IconLabel',
  component: IconLabel
};

export const iconLabels = () => (
  <div>
    <IconLabel text="Only a label" />
    <IconLabel type="lib_release_rocket" />
    <IconLabel text="A red icon with label" color="red" type="lib_release_rocket" />
    <div style={{ border: '1px solid black' }}>
      <IconLabel text="Icon with a label -> with button margin" type="lib_release_rocket" />
    </div>
    <div style={{ border: '1px solid black' }}>
      <IconLabel text="Icon with a label -> without button margin" type="lib_release_rocket" noBottomMargin />
    </div>
  </div>
);
