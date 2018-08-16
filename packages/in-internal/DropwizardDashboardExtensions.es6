import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getContextForDropwizard } from 'in-internal/dataRetrieval';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(({ snapshot, timeConfig }) => ({
  context: getContextForDropwizard(snapshot, timeConfig)
}))(function DropwizardDashboardExtensions({ context }) {
  if (!context) {
    return null;
  }

  const { host: hostSnapshot, container } = context;
  const fqdn = hostSnapshot.getIn(['data', 'fqdn']);
  const jobName = container.getIn(['data', 'Nomad', 'jobName']);

  const host = fqdn.replace('.instana.io', '');
  const adminPort = container.getIn(['data', 'Nomad', 'ports', 'check']);
  const adminUrl = `http://${host}:${adminPort}`;

  const logUrl = `https://app.logdna.com/0b5bf8ca43/logs/view?apps=${encodeURIComponent(
    jobName
  )}&hosts=${encodeURIComponent(fqdn)}`;

  return (
    <DashboardSection>
      <Button href={adminUrl} target="_blank">
        Admin
      </Button>
      <Button href={`${adminUrl}/admin/config.yaml`} target="_blank">
        Config
      </Button>
      <Button href={logUrl} target="_blank">
        Logs
      </Button>
      <Button href={`${adminUrl}/admin/build.json`} target="_blank">
        Version
      </Button>
      <Button href={`${adminUrl}/admin/injector-bindings`} target="_blank">
        Injector Bindings
      </Button>
      <Button href={`${adminUrl}/hystrix`} target="_blank">
        Hystrix
      </Button>
    </DashboardSection>
  );
});
