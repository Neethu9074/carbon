import React from 'react';

import StackItem from 'in-new-components/layout/Stack/StackItem';
import Header from 'in-components/form/Header/Header';
import Stack from 'in-new-components/layout/Stack';

export default function FormComponent({ widgetTitleFormGroup, widgetPreview }) {
  return (
    <Stack space="large">
      <StackItem>
        <Header>Customize the Widget</Header>
        {widgetTitleFormGroup}
      </StackItem>

      <StackItem>
        <Header>SLO Configuration...</Header>
        {widgetPreview}
      </StackItem>
    </Stack>
  );
}
