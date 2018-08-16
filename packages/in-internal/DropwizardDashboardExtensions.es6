import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getContextForDropwizard } from 'in-internal/dataRetrieval';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';
import Select from 'in-components/form/Select';

import './DropwizardDashboardExtension.less';

const block = 'dropwizard-extension-select-box';

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
      {container.get('label').includes('appdata-processor') && (
        <Select
          id="tag-selection"
          value=""
          className={block + '__select'}
          onChange={e => window.open(e.target.value, '_blank')}
          autoFocus
        >
          <option value="">Tag data (select one)</option>
          <option value={`${adminUrl}/admin/physicalAttributeStore`}>All Tags</option>
          <option value={`${adminUrl}/admin/physicalAttributeStore/cluster`}>Cluster Tags</option>
          <option value={`${adminUrl}/admin/physicalAttributeStore/alternatives`}>Host/port references</option>
        </Select>
      )}
    </DashboardSection>
  );
});
