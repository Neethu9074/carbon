import React, { Fragment } from 'react';

import { getContextForDropwizard } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
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

  const { host: hostSnapshot, container, jvm, pod } = context;
  const fqdn = hostSnapshot.getIn(['data', 'fqdn'], '');
  const jobName = container.getIn(['data', 'Nomad', 'jobName']);

  const host = extractHost(pod, fqdn);
  const adminPort = extractPort(pod, container);
  const adminUrl = `http://${host}:${adminPort}`;

  const logUrl = `https://app.logdna.com/0b5bf8ca43/logs/view?apps=${encodeURIComponent(
    jobName
  )}&hosts=${encodeURIComponent(fqdn)}`;

  const getLogsCommand = extractLogsCommand(pod, container, jvm, fqdn);

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
            <option value={`${adminUrl}/admin/appCacheEntries?size=50&minEntities=0`}>Application Mapping</option>
            <option value={`${adminUrl}/admin/serviceCacheEntries?size=50&minEntities=0`}>Service Mapping</option>
            <option value={`${adminUrl}/admin/pathTemplateEntries`}>Endpoint Mapping (Path template cache)</option>
            <option value={`${adminUrl}/admin/invalidPathTemplates`}>Endpoint Mapping (Invalid path templates)</option>
          </Select>
        )}
      </DashboardSection>

      <DashboardSection title="Common Commands">
        <Code lang="bash" code={getLogsCommand} showLineNumbers={false} />
      </DashboardSection>
    </Fragment>
  );
});

function containerLabelIncludes(container, includedString) {
  return container.get('label').indexOf(includedString) !== -1;
}

function extractHost(pod, fqdn) {
  if (pod) {
    const podIp = pod.getIn(['data', 'podIp']);
    if (podIp) {
      return podIp;
    }
  }
  return fqdn.replace('.instana.io', '');
}

function extractPort(pod, container) {
  if (pod) {
    try {
      const adminPortDefinition = JSON.parse(
        container.getIn(['data', 'Labels', 'annotation.io.kubernetes.container.ports'])
      ).find(l => l.name === 'admin');
      if (adminPortDefinition) {
        return adminPortDefinition.containerPort;
      }
    } catch (e) {
      // ignore
    }
  }
  return container.getIn(['data', 'Nomad', 'ports', 'check']);
}

function extractLogsCommand(pod, container, jvm, fqdn) {
  if (pod) {
    const namespace = pod.getIn(['data', 'namespace']);
    const name = pod.getIn(['data', 'name']);
    const app = pod.getIn(['data', 'labels', 'app']);
    return `
# Kubectl not configured? Check the "kubectl" section in the
# "K8S: Environments" slide deck in Google docs.

# Get the configuration file
kubectl exec --namespace ${namespace} ${name} -- cat '/etc/instana/${app}/config.yaml' | less

# Get logs directly via kubectl.
kubectl logs --namespace ${namespace} ${name} ${app} | less

# Enter the container
kubectl exec -it --namespace ${namespace} ${name} -- bash

# Forward ports locally
kubectl port-forward --namespace ${namespace} ${name} 8600 8601
      `.trim();
  }
  const allocId = container.getIn(['data', 'Nomad', 'allocId']);
  const componentName = jvm.getIn(['data', 'appInfo', 'title']);
  return `
# Get logs directly from machine. Remember to insert your user name
ssh -t $INSTANA_LDAP_USER@${fqdn} 'less /mnt/data/nomad/alloc/${allocId}/alloc/logs/${componentName}.log'
    `.trim();
}
