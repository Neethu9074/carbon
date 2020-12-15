import React from 'react';

import TagFilterConfiguration from 'in-custom-dashboards/widgets/Slo/sli/TagFilterConfiguration';
import TouchedMessages from 'in-components/form/TouchedMessages';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Header from 'in-components/form/Header';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

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
  const goodEventFiltersForm = sliEntityForm?.get('goodEventFilters');
  const badEventFiltersForm = sliEntityForm?.get('badEventFilters');

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

  const goodEventFilters = [...goodEventFiltersForm?.value, applicationIdTagFilter, applicationNameTagFilter];
  const badEventFilters = [...badEventFiltersForm?.value, applicationIdTagFilter, applicationNameTagFilter];

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
      {goodEventFiltersForm && <TouchedMessages field={goodEventFiltersForm} className={locals.validationText} />}
      <Header>Bad Events</Header>
      <TagFilterConfiguration
        tagFilters={badEventFilters}
        onChange={onBadChange}
        timeConfig={timeConfig}
        excludedTagFilters={excludedTagFilters}
        hiddenFilterNames={hiddenFilterNames}
      />
      {badEventFiltersForm && <TouchedMessages field={badEventFiltersForm} className={locals.validationText} />}
    </StackItem>
  );
}

function withoutViewHiddenFilters(tagFilters) {
  return tagFilters.filter(tf => !hiddenFilterNames.includes(tf.name));
}
