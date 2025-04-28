/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';

import { Select, Button, Toggle } from '@instana/components';

import { getContextForDropwizard } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import connect from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import './DropwizardDashboardExtension.less';

const block = 'dropwizard-extension-select-box';

export default connect(({ snapshot, timeConfig }) => ({
  context: getContextForDropwizard(snapshot, timeConfig)
}))(function DropwizardDashboardExtensions({ context }) {
  const [portForward, setPortForward] = useState(true);
  if (!context) {
    return null;
  }

  const { container, pod, host } = context;

  const hostIp = portForward ? 'localhost' : extractHostFromPod(pod) || extractHostFqdn(host);
  const adminPort = extractPort(container);
  const adminUrl = `http://${hostIp}:${adminPort}`;

  const getLogsCommand = extractLogsCommand(pod);

  return (
    <Fragment>
      {getLogsCommand && (
        <DashboardSection title={t('in-internal:monitoringUnit.dropwizardDashboardExt.commonCommands')}>
          <Code lang="bash" code={getLogsCommand} showLineNumbers={false} />
        </DashboardSection>
      )}
      <DashboardSection>
        <div>
          <Toggle
            checked={portForward}
            labelA={t('in-internal:monitoringUnit.dropwizardDashboardExt.vpn')}
            labelB={t('in-internal:monitoringUnit.dropwizardDashboardExt.portForward')}
            onToggle={() => {
              setPortForward(_portForward => !_portForward);
            }}
          />
        </div>
        <div>
          <Button href={adminUrl} target="_blank">
            {t('in-internal:monitoringUnit.dropwizardDashboardExt.admin')}
          </Button>
          <Button href={`${adminUrl}/admin/config.yaml`} target="_blank">
            {t('in-internal:monitoringUnit.dropwizardDashboardExt.config')}
          </Button>
          <Button href={`${adminUrl}/admin/build.json`} target="_blank">
            {t('in-internal:monitoringUnit.dropwizardDashboardExt.version')}
          </Button>
          <Button href={`${adminUrl}/admin/injector-bindings`} target="_blank">
            {t('in-internal:monitoringUnit.dropwizardDashboardExt.injectorBindings')}
          </Button>

          {containerLabelIncludes(container, 'filler') && (
            <Fragment>
              <Button href={`${adminUrl}/admin/metric-explosions`} target="_blank">
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.metricExplosions')}
              </Button>
              <Select
                id="cache-selection"
                value=""
                className={block + '__select'}
                onChange={e => window.open(e.target.value, '_blank')}
                autoFocus
              >
                <option value="">{t('in-internal:monitoringUnit.dropwizardDashboardExt.cacheDataSelectOne')}</option>
                <option value={`${adminUrl}/admin/snapshots`}>
                  {t('in-internal:monitoringUnit.dropwizardDashboardExt.snapshotsDepend')}
                </option>
                <option value={`${adminUrl}/admin/search-snapshots`}>
                  {t('in-internal:monitoringUnit.dropwizardDashboardExt.searchSnapshots')}
                </option>
              </Select>
            </Fragment>
          )}

          {containerLabelIncludes(container, 'ap-legacy-converter') && (
            <Button href={`${adminUrl}/admin/appdata-entity-explosions`} target="_blank">
              {t('in-internal:monitoringUnit.dropwizardDashboardExt.appdataEntityExplosions')}
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
              <option value="">{t('in-internal:monitoringUnit.dropwizardDashboardExt.tagDataSelectOne')}</option>
              <option value={`${adminUrl}/admin/applicationTagCache`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.allTags')}
              </option>
              <option value={`${adminUrl}/admin/applicationTagCache/cluster`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.clusterTags')}
              </option>
              <option value={`${adminUrl}/admin/applicationTagCache/alternatives`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.hostPortRef')}
              </option>
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
              <option value="">{t('in-internal:monitoringUnit.dropwizardDashboardExt.resilientMapSelectOne')}</option>
              <option value={`${adminUrl}/admin/appCacheEntries?size=50&minEntities=0`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.appMapping')}
              </option>
              <option value={`${adminUrl}/admin/serviceCacheEntries?size=50&minEntities=0`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.serviceMapping')}
              </option>
              <option value={`${adminUrl}/admin/pathTemplateEntries`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.endpointMapPathTemplateCache')}
              </option>
              <option value={`${adminUrl}/admin/invalidPathTemplates`}>
                {t('in-internal:monitoringUnit.dropwizardDashboardExt.endpointMapInvalidPathTemplates')}
              </option>
            </Select>
          )}

          {containerLabelIncludes(container, 'acceptor', ['eum', 'serverless', 'cashier']) && (
            <Button href={`${adminUrl}/admin/agentTimeSkewEntries`} target="_blank">
              {t('in-internal:monitoringUnit.dropwizardDashboardExt.agentClockSkew')}
            </Button>
          )}
        </div>
      </DashboardSection>
    </Fragment>
  );
});

// notIncluding parameter takes a list, for example to include "acceptor" but exclude "eum-acceptor".
function containerLabelIncludes(container, includedString, notIncludingList) {
  if (Array.isArray(notIncludingList)) {
    return (
      container.get('label').indexOf(includedString) !== -1 &&
      !notIncludingList.find(key => container.get('label').indexOf(key) !== -1)
    );
  } else {
    return container.get('label').indexOf(includedString) !== -1;
  }
}

function extractHostFromPod(pod) {
  if (pod) {
    const podIp = pod.getIn(['data', 'podIp']);
    if (podIp) {
      return podIp;
    }
  }
}

function extractHostFqdn(host) {
  if (host) {
    const fqdn = host.getIn(['data', 'fqdn']);
    if (fqdn) {
      return fqdn;
    }
  }
}

function extractPort(container) {
  try {
    const adminPortDefinition = JSON.parse(container.getIn(['data', 'labels', 'io.kubernetes.container.ports'])).find(
      l => l.name === 'admin'
    );
    if (adminPortDefinition) {
      return adminPortDefinition.containerPort;
    }
  } catch (e) {
    // ignore
  }
}

function extractLogsCommand(pod) {
  if (pod) {
    const namespace = pod.getIn(['data', 'namespace']);
    const name = pod.getIn(['data', 'name']);
    const app = pod.getIn(['data', 'labels', 'app']);
    return `
# In order to use the admin port, you need to forward the ports locally.

# Switch the Kubernetes context
kubectx ${namespace?.replace('-', '.club-')}

# Get the configuration file (credentials are at the end of the file)
kubectl exec --namespace ${namespace} ${name} -- cat '/etc/instana/${app}/config.yaml'

# Forward ports locally to be able to use the buttons below
kubectl port-forward --namespace ${namespace} ${name} 8600 8601

# Get logs
kubectl logs --namespace ${namespace} ${name} ${app} | less

# Enter the container
kubectl exec -it --namespace ${namespace} ${name} -- bash
      `.trim();
  }
}
