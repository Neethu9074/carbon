import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default {
  title: 'Molecules|DashboardNotification',
  component: DashboardNotification
};

export function KindsStory() {
  return (
    <>
      <DashboardNotification type="neutral">this is a neutral message</DashboardNotification>
      <DashboardNotification type="info">this is an info</DashboardNotification>
      <DashboardNotification type="warning">this is a warning</DashboardNotification>
      <DashboardNotification type="danger">this is an error</DashboardNotification>
    </>
  );
}

export function ContentStory() {
  return (
    <>
      <DashboardNotification type="info">you can place just text in here </DashboardNotification>
      <DashboardNotification type="info">
        <strong>OR</strong>
        <br />
        you can place whatever custom content you want to have and
        <p>both!!</p>
        box
      </DashboardNotification>
    </>
  );
}
