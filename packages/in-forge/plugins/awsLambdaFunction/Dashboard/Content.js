/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DashboardVersionsList from './DashboardVersionsList';
import { Trans } from 'in-i18n';

export default function AwsLambdaFunctionDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  let noAwsAgentData = null;
  const name = snapshot.getIn(['data', 'name']);
  if (name == null) {
    noAwsAgentData = (
      <DashboardNotification type="danger">
        <Trans
          i18nKey="in-forge:plugins.awsLambdaFunction.descriptionLambda"
          components={{
            installLink: <a href="https://instana.com/docs/ecosystem/aws#installation" />
          }}
        />
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
