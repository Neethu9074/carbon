/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

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

  const { container, pod } = context;

  const host = extractHost(pod);
  const adminPort = extractPort(pod, container);
  const adminUrl = `http://${host}:${adminPort}`;

  const getLogsCommand = extractLogsCommand(pod);

  return (
    <Fragment>
      <DashboardSection>
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
        <Button href={`${adminUrl}/hystrix`} target="_blank">
          {t('in-internal:monitoringUnit.dropwizardDashboardExt.hystrix')}
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
            <option value={`${adminUrl}/admin/physicalAttributeStore`}>
              {t('in-internal:monitoringUnit.dropwizardDashboardExt.allTags')}
            </option>
            <option value={`${adminUrl}/admin/physicalAttributeStore/cluster`}>
              {t('in-internal:monitoringUnit.dropwizardDashboardExt.clusterTags')}
            </option>
            <option value={`${adminUrl}/admin/physicalAttributeStore/alternatives`}>
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
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.dropwizardDashboardExt.commonCommands')}>
        <Code lang="bash" code={getLogsCommand} showLineNumbers={false} />
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

function extractHost(pod) {
  if (pod) {
    const podIp = pod.getIn(['data', 'podIp']);
    if (podIp) {
      return podIp;
    }
  }
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
}

function extractLogsCommand(pod) {
  if (pod) {
    const namespace = pod.getIn(['data', 'namespace']);
    const name = pod.getIn(['data', 'name']);
    const app = pod.getIn(['data', 'labels', 'app']);
    return `
# Kubectl not configured? Check the "kubectl" section in the
# "K8S: Environments" slide deck in Google docs.

# Remember to switch the Kubernetes context
kubectx ${namespace}

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
}
