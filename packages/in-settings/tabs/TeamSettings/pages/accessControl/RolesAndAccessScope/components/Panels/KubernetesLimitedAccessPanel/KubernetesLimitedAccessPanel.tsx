/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Stack, StackItem, Typography } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import KubernetesNamespacesTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/KubernetesNamespacesTable';
import KubernetesClustersTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/KubernetesClustersTable';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { noop } from 'in-services/fixedObjects';

import locals from './KubernetesLimitedAccessPanel.mless';

/**
 * Actual component
 * @returns current instance
 */
export default function _KubernetesLimitedAccessPanel({ form, setForm }: FormControlProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  if (!permissionSetField?.value) return null;

  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.selection_limited_access')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {t('in-settings:PermissionSection.descriptionAccessLimited_kubernetes')}
        </Typography>
      </StackItem>
      <StackItem>
        <div className={locals.contentHeader}>
          <Typography variant="body-bold" component="div">
            {t('in-settings:PermissionSection.limitedAccessKubernetes_namespaces')}
          </Typography>
        </div>
      </StackItem>
      <StackItem>
        <Button kind="action" onClick={noop} icon="lib_openclose_add_circle_outline" disabled>
          {t('in-settings:PermissionSection.limitedAccessKubernetes_addNamespace')}
        </Button>
      </StackItem>
      <KubernetesNamespacesTable form={form} setForm={setForm} />
      <StackItem>
        <div className={locals.contentHeader}>
          <Typography variant="body-bold" component="div">
            {t('in-settings:PermissionSection.limitedAccessKubernetes_clusters')}
          </Typography>
        </div>
      </StackItem>
      <StackItem>
        <Button kind="action" onClick={noop} icon="lib_openclose_add_circle_outline" disabled>
          {t('in-settings:PermissionSection.limitedAccessKubernetes_addCluster')}
        </Button>
      </StackItem>
      <KubernetesClustersTable form={form} setForm={setForm} />
    </Stack>
  );
}
