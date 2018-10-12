import { storiesOf } from '@storybook/react';
import { just } from 'reactive-observables';
import { range } from 'lodash';
import React from 'react';

import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import { pendingResult, finishedProgress } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';
import Root from '../../_helpers/Root';

storiesOf('Components/health/OpenIssuesListPresenter', module)
  .add('loading', () => <LoadingIndeterminate />)
  .add('error', () => <Errors />)
  .add('design library case', () => <DesignLibraryCase />)
  .add('Markdown description', () => <MarkdownDescription />)
  .add('Long Fix Suggestion', () => <LongFixSuggestion />)
  .add('Large number of issues', () => <LargeNumberOfIsses />);

function Wrapper({ children }) {
  return (
    <Root>
      <div
        style={{
          maxWidth: '25rem',
          border: '1px solid #DFE4E8'
        }}
      >
        {children}
      </div>
    </Root>
  );
}

function DesignLibraryCase() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter
        openIssuesResult={success([getIssue({ severity: 5 }), getIssue({ severity: 10 })])}
        getIssueLink={() => just('#')}
      />
    </Wrapper>
  );
}

function LongFixSuggestion() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter
        openIssuesResult={success([
          getIssue({
            description: range(0, 2000)
              .map(() => 'a')
              .join()
          }),
          getIssue({ severity: 10 })
        ])}
      />
    </Wrapper>
  );
}

function MarkdownDescription() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter
        openIssuesResult={success([
          getIssue({
            title: 'With lists',
            description: `
Something really terrible went down 😿

 - kitty wanted the fishy
 - fishy was **too fast**
 - the end
`.trim()
          }),
          getIssue({
            title: 'Paragraph as last item',
            description: `
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`.trim()
          })
        ])}
      />
    </Wrapper>
  );
}

function LargeNumberOfIsses() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter
        openIssuesResult={success(
          range(1, 20)
            .map(() => Math.round(Math.random() * 10))
            .map(severity =>
              getIssue({
                severity,
                title: `Issue with severity ${severity}`
              })
            )
        )}
      />
    </Wrapper>
  );
}

function LoadingIndeterminate() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter openIssuesResult={pendingResult} />
    </Wrapper>
  );
}

function Errors() {
  return (
    <Wrapper>
      <OpenIssuesListPresenter
        openIssuesResult={{
          data: null,
          progress: finishedProgress,
          errors: [
            {
              message: 'Unexpected server error',
              code: 'SERVER'
            }
          ]
        }}
      />
    </Wrapper>
  );
}

function getIssue({
  severity = 5,
  title = 'It is a paradisematic country',
  description = 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
  start = Date.now()
}) {
  return {
    id: String(Math.random()),
    start,
    problem: {
      problemText: title,
      fixSuggestion: description,
      severity
    }
  };
}
