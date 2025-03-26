/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

// @ts-expect-error import Steps from 'in-applications/Forms/components/Steps';
import Steps from 'in-applications/Forms/components/Steps';
// @ts-expect-error import BasicForm from 'in-applications/Forms/BasicForm';
import BasicForm from 'in-applications/Forms/BasicForm';

export default {
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
