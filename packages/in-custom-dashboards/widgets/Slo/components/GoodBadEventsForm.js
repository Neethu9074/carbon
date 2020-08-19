import React from 'react';

import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Header from 'in-components/form/Header';

export default function EventBasedForm({ form, onChange }) {
  const timeConfig = useTimeConfig();

  const sliEntityForm = form.get('sliEntity');
  const goodEventFilters = sliEntityForm?.get('goodEventFilters')?.value;
  const badEventFilters = sliEntityForm?.get('badEventFilters')?.value;

  const onGoodChange = params => {
    onChange(['sliEntity', 'goodEventFilters'], f => f.setValue(params).setTouched(true));
  };

  const onBadChange = params => {
    onChange(['sliEntity', 'badEventFilters'], f => f.setValue(params).setTouched(true));
  };

  return (
    <StackItem>
      <Header>Good Events</Header>
      <TagFilterConfiguration tagFilters={goodEventFilters} onChange={onGoodChange} timeConfig={timeConfig} />
      <Header>Bad Events</Header>
      <TagFilterConfiguration tagFilters={badEventFilters} onChange={onBadChange} timeConfig={timeConfig} />
    </StackItem>
  );
}
