import React from 'react';

import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Header from 'in-components/form/Header';

const excludedTagFilters = [
  'application.name',
  'application.id',
  'boundary.application.id',
  'call.inbound_of_application'
];
const hiddenFilterNames = ['application.id', 'application.name'];

export default function EventBasedForm({ form, applicationName, onChange }) {
  const timeConfig = useTimeConfig();
  const sliEntityForm = form.get('sliEntity');

  const applicationIdTagFilter = {
    entity: 'DESTINATION',
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: sliEntityForm.get('applicationId').value
  };

  const applicationNameTagFilter = {
    entity: 'DESTINATION',
    name: 'application.name',
    operator: 'EQUALS',
    stringValue: applicationName
  };

  const goodEventFilters = [
    ...sliEntityForm?.get('goodEventFilters')?.value,
    applicationIdTagFilter,
    applicationNameTagFilter
  ];
  const badEventFilters = [
    ...sliEntityForm?.get('badEventFilters')?.value,
    applicationIdTagFilter,
    applicationNameTagFilter
  ];

  const onGoodChange = params => {
    onChange(['sliEntity', 'goodEventFilters'], f => f.setValue(withoutViewHiddenFilters(params)).setTouched(true));
  };

  const onBadChange = params => {
    onChange(['sliEntity', 'badEventFilters'], f => f.setValue(withoutViewHiddenFilters(params)).setTouched(true));
  };

  return (
    <StackItem>
      <Header>Good Events</Header>
      <TagFilterConfiguration
        tagFilters={goodEventFilters}
        onChange={onGoodChange}
        timeConfig={timeConfig}
        excludedTagFilters={excludedTagFilters}
        hiddenFilterNames={hiddenFilterNames}
      />
      <Header>Bad Events</Header>
      <TagFilterConfiguration
        tagFilters={badEventFilters}
        onChange={onBadChange}
        timeConfig={timeConfig}
        excludedTagFilters={excludedTagFilters}
        hiddenFilterNames={hiddenFilterNames}
      />
    </StackItem>
  );
}

function withoutViewHiddenFilters(tagFilters) {
  return tagFilters.filter(tf => !hiddenFilterNames.includes(tf.name));
}
