import React, { Fragment } from 'react';

import { getContextForDropwizard } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Button from 'in-new-components/Button';
import Select from 'in-components/form/Select';
import connect from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import './DropwizardDashboardExtension.less';

const block = 'dropwizard-extension-select-box';

export default connect(({ snapshot, timeConfig }) => ({
  context: getContextForDropwizard(snapshot, timeConfig)
}))(function DropwizardDashboardExtensions({ context }) {
  if (!context) {
    return null;
  }

  const { host: hostSnapshot, container, jvm } = context;
  const fqdn = hostSnapshot.getIn(['data', 'fqdn'], '');
  const jobName = container.getIn(['data', 'Nomad', 'jobName']);
  const allocId = container.getIn(['data', 'Nomad', 'allocId']);
  const componentName = jvm.getIn(['data', 'appInfo', 'title']);

  const host = fqdn.replace('.instana.io', '');
  const adminPort = container.getIn(['data', 'Nomad', 'ports', 'check']);
  const adminUrl = `http://${host}:${adminPort}`;

  const logUrl = `https://app.logdna.com/0b5bf8ca43/logs/view?apps=${encodeURIComponent(
    jobName
  )}&hosts=${encodeURIComponent(fqdn)}`;

  const getLogsCommand = `
# Get logs directly from machine. Remember to insert your user name
ssh -t $INSTANA_LDAP_USER@${fqdn} 'less /mnt/data/nomad/alloc/${allocId}/alloc/logs/${componentName}.log'
`.trim();

  return (
    <Fragment>
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

        {containerLabelIncludes(container, 'filler') && (
          <Fragment>
            <Button href={`${adminUrl}/admin/metric-explosions`} target="_blank">
              Metric Explosions
            </Button>
            <Select
              id="cache-selection"
              value=""
              className={block + '__select'}
              onChange={e => window.open(e.target.value, '_blank')}
              autoFocus
            >
              <option value="">Cache data (select one)</option>
              <option value={`${adminUrl}/admin/snapshots`}>Snapshots with Dependencies</option>
              <option value={`${adminUrl}/admin/search-snapshots`}>Search Snapshots</option>
            </Select>
          </Fragment>
        )}

        {containerLabelIncludes(container, 'ap-legacy-converter') && (
          <Button href={`${adminUrl}/admin/appdata-entity-explosions`} target="_blank">
            Appdata Entity Explosions
          </Button>
        )}

        {containerLabelIncludes(container, 'appdata-processor') && (
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

        {containerLabelIncludes(container, 'appdata-processor') && (
          <Select
            id="resilient-selection"
            value=""
            className={block + '__select'}
            onChange={e => window.open(e.target.value, '_blank')}
            autoFocus
          >
            <option value="">Resilient mapping (select one)</option>
            <option value={`${adminUrl}/admin/appClassifications?size=50&minLabels=0`}>Application Mapping</option>
            <option value={`${adminUrl}/admin/serviceClassifications?size=50&minLabels=0`}>Service Mapping</option>
          </Select>
        )}
      </DashboardSection>

      <DashboardSection title="Common Commands">
        <Code lang="plain" code={getLogsCommand} showLineNumbers={false} />
      </DashboardSection>
    </Fragment>
  );
});

function containerLabelIncludes(container, includedString) {
  return container.get('label').indexOf(includedString) !== -1;
}
