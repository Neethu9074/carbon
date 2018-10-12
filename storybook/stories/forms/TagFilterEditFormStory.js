import { compose, withState } from 'recompose';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { getInitialForm } from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditForm from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Forms/Tag Filter Edit Form', module).add('Edit View', () => <TagFilterEditFormStory />);

function TagFilterEditFormStory() {
  window.instana.tags = [
    { name: 'nodejs.mode' },
    { name: 'nodejs.app' },
    { name: 'nodejs.app.version' },
    { name: 'nodejs.app.name' },
    { name: 'nodejs.app.label' },
    { name: 'docker.label' },
    { name: 'io.kubernetes.pod.label' }
  ];

  return (
    <Root>
      <Section title="Known Tag">
        <StatefulEditView type="STRING" />
      </Section>

      <Section title="Unknown Tag">
        <StatefulUnknownEditView type="STRING" />
      </Section>
    </Root>
  );
}

const StatefulUnknownEditView = compose(
  withState('name', 'setName', 'this.is.an.unknown.key'),
  withState('value', 'setValue', 'foobar')
)(StatefulEditViewComponent);

const StatefulEditView = compose(
  withState('name', 'setName', 'nodejs.app.version'),
  withState('value', 'setValue', '4.53.321')
)(StatefulEditViewComponent);

function StatefulEditViewComponent({ name, value, setName, setValue }) {
  return (
    <EditForm
      form={getInitialForm(name, value)}
      onChange={(fieldName, value) => {
        if (fieldName === 'name') {
          setName(value);
        }
        if (fieldName === 'value') {
          setValue(value);
        }
      }}
    />
  );
}
