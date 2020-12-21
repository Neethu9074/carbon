import { just } from '@instana/observables';
import React from 'react';

import Steps from 'in-applications/Forms/components/Steps';
import BasicForm from 'in-applications/Forms/BasicForm';

export default {
  title: 'Templates|forms/BasicForm',
  component: BasicForm
};

export function LoadingStory() {
  return (
    <BasicForm
      title="Form Title"
      form={createDummyForm()}
      getEntity={() => just({ progress: { loading: true }, errors: [] })}
    />
  );
}

export function ErrorsStory() {
  return (
    <BasicForm
      title="Form Title"
      form={createDummyForm()}
      getEntity={() => just({ progress: { loading: false }, errors: [{ message: 'Some error happened.' }] })}
    />
  );
}

export function DefaultStory() {
  return (
    <BasicForm
      title="Form Title"
      generalHelpText="This is a general help text."
      getEntity={() => just({ progress: { loading: false }, errors: [], data: {} })}
      getInitialForm={createDummyForm}
      renderFormContent={() => {
        return <Steps steps={[{ stepTitle: 'first step' }, { stepTitle: 'second step' }]} />;
      }}
    />
  );
}

function createDummyForm() {
  return { hierarchyValid: true, touched: true };
}
