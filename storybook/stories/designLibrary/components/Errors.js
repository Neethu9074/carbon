import { storiesOf } from '@storybook/react';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Errors', module).add('Errors', () => <ErrorsStory />);

function ErrorsStory() {
  return (
    <Root>
      <Section title="Erroneous Result Presenter single message">
        <ErroneousResultPresenter errors={[{ message: 'A backend error occured' }]} />
      </Section>
      <Section title="Erroneous Result Presenter multi messages">
        <ErroneousResultPresenter
          errors={[{ message: 'A backend error occured' }, { message: 'This is another error message' }]}
        />
      </Section>

      <Section title="No Data available default">
        <NoDataAvailable width={400} height={100} />
      </Section>
      <Section title="No Data available small">
        <NoDataAvailable width={72} height={24} />
      </Section>
    </Root>
  );
}
