/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DashboardVersionsList from './DashboardVersionsList';

export default function AwsLambdaFunctionDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  let noAwsAgentData = null;
  const name = snapshot.getIn(['data', 'name']);
  if (name == null) {
    noAwsAgentData = (
      <DashboardNotification type="danger">
        It seems you are not monitoring this Lambda with an Instana agent. Setting up an AWS agent for the corresponding
        AWS account is a pre-requisite for native Lambda tracing. Please check our documentation on that, in particular
        the <a href="https://instana.com/docs/ecosystem/aws#installation">AWS agent installation docs</a>.
      </DashboardNotification>
    );
  }

  return (
    <>
      {noAwsAgentData}
      <DashboardVersionsList snapshotId={snapshotId} />
    </>
  );
}
