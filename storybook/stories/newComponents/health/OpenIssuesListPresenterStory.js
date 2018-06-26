import { storiesOf } from '@storybook/react';
import { range } from 'lodash';
import React from 'react';

import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import Root from '../../_helpers/Root';

storiesOf('newComponents/health/OpenIssuesListPresenter', module)
  .add('design library case', () => <DesignLibraryCase />)
  .add('Markdown description', () => <MarkdownDescription />)
  .add('Long Fix Suggestion', () => <LongFixSuggestion />)
  .add('Large number of issues', () => <LargeNumberOfIsses />);

function Wrapper({children}) {
  return (
    <Root>
      <div style={{
        maxWidth: '25rem',
        border: '1px solid #DFE4E8'
      }}>
        {children}
      </div>
    </Root>
  );
}

function DesignLibraryCase() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter openIssues={[
        getIssue({severity: 5}),
        getIssue({severity: 10})
      ]} />
    </Wrapper>
  );
}

function LongFixSuggestion() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter openIssues={[
        getIssue({description: range(0, 2000).map(() => 'a').join()}),
        getIssue({severity: 10})
      ]} />
    </Wrapper>
  );
}

function MarkdownDescription() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter openIssues={[
        getIssue({
          description: `
Something really terrible went down 😿

 - kitty wanted the fishy
 - fishy was **too fast**
 - the end
`.trim()
        })
      ]} />
    </Wrapper>
  );
}

function LargeNumberOfIsses() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter openIssues={range(1, 20).map(() => Math.round(Math.random() * 10)).map(severity => getIssue({
        severity,
        title: `Issue with severity ${severity}`
      }))} />
    </Wrapper>
  );
}

function getIssue({
  severity = 5,
  title = 'It is a paradisematic country',
  description = 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.'
}) {
  return {
    id: String(Math.random()),
    problem: {
      problemText: title,
      fixSuggestion: description,
      severity
    }
  };
}
