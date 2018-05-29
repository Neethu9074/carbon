import { storiesOf } from '@storybook/react';
import { just } from 'reactive-observables';
import React from 'react';

import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Forms/BasicForm', module)
  .add('Loading', () => <LoadingStory />)
  .add('Errors', () => <ErrorsStory />)
  .add('Default', () => <DefaultStory />);

function LoadingStory() {
  return (
    <Root>
      <BasicForm
        title="Form Title"
        form={createDummyForm()}
        getEntity={() => just({ progress: { loading: true }, errors: [] })}
      />
    </Root>
  );
}

function ErrorsStory() {
  return (
    <Root>
      <BasicForm
        title="Form Title"
        form={createDummyForm()}
        getEntity={() => just({ progress: { loading: false }, errors: [{ message: 'Some error happened.' }] })}
      />
    </Root>
  );
}

function DefaultStory() {
  return (
    <Root>
      <BasicForm
        title="Form Title"
        generalHelpText="This is a general help text."
        getEntity={() => just({ progress: { loading: false }, errors: [], data: {} })}
        getInitialForm={createDummyForm}
        renderFormContent={() => {
          return <Steps steps={[{ stepTitle: 'first step' }, { stepTitle: 'second step' }]} />;
        }}
      />
    </Root>
  );
}

function createDummyForm() {
  return { hierarchyValid: true, touched: true };
}
