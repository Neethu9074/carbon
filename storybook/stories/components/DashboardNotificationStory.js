import { storiesOf } from '@storybook/react';
import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

import Root from '../_helpers/Root';

storiesOf('Components/Dashboard Notification', module)
  .add('Kinds', () => <KindsStory />)
  .add('Content', () => <ContentStory />);

function KindsStory() {
  return (
    <Root>
      <DashboardNotification type="info">this is an info</DashboardNotification>
      <DashboardNotification type="warning">this is a warning</DashboardNotification>
      <DashboardNotification type="danger">this is an error</DashboardNotification>
    </Root>
  );
}

function ContentStory() {
  return (
    <Root>
      <DashboardNotification type="info">you can place just text in here </DashboardNotification>
      <DashboardNotification type="info">
        <strong>OR</strong>
        <br />
        you can place whatever custom content you want to have and
        <p>both!!</p>
        box
      </DashboardNotification>
    </Root>
  );
}
