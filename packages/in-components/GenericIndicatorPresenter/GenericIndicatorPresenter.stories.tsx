/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactElement } from 'react';

import { Button, ContainedList, ContainedListItem } from '@instana/carbon';

import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';

export default {
  component: GenericIndicatorPresenter,
  title: 'in-components/GenericIndicatorPresenter',
  parameters: {
    docs: {
      description: {
        component: `
          A generic component for displaying a popover with custom content when an indicator is clicked.
          This component is designed to be reused across different use cases where a clickable indicator
          should display additional content in a popover.
        `
      }
    }
  }
};

// Simple content component
const SimpleContent = () => (
  <div style={{ padding: '16px', maxWidth: '300px' }}>
    <h3>Additional Information</h3>
    <p>This is some additional information that appears in a popover when the indicator is clicked.</p>
    <Button size="sm" kind="ghost">
      Button to link somewhere else
    </Button>
  </div>
);

export const Basic = () => (
  <div style={{ padding: '50px' }}>
    <GenericIndicatorPresenter
      Content={SimpleContent}
      contentProps={{}}
      IndicatorPresenter={Button}
      indicatorProps={{ onClick: () => {}, size: 'sm', children: 'Show popover' }}
      inContentArea={false}
    />
  </div>
);

const IssuesContent = () => (
  <ContainedList label="Issues" size="sm">
    <ContainedListItem>Server CPU usage above 90%</ContainedListItem>
    <ContainedListItem>Memory usage increasing steadily</ContainedListItem>
    <ContainedListItem>Slow Response Time</ContainedListItem>
  </ContainedList>
);

export const ListContent = () => (
  <div style={{ padding: '50px' }}>
    <GenericIndicatorPresenter
      Content={IssuesContent}
      contentProps={{}}
      IndicatorPresenter={Button}
      indicatorProps={{ onClick: () => {}, size: 'sm', children: 'Show popover' }}
      inContentArea={false}
    />
  </div>
);

// Example with content area alignment
export const InContentArea = (): ReactElement => (
  <div style={{ padding: '50px' }}>
    <GenericIndicatorPresenter
      Content={SimpleContent}
      contentProps={{}}
      IndicatorPresenter={Button}
      indicatorProps={{ onClick: () => {}, size: 'sm', children: 'Show popover' }}
      inContentArea
    />
    <p style={{ marginTop: '20px' }}>
      This example uses the <code>inContentArea</code> prop to change the popover alignment and behavior.
    </p>
  </div>
);
