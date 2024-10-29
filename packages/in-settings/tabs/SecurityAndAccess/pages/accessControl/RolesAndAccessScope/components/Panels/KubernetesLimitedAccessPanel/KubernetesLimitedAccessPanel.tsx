/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';
import { PermissionSet } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import KubernetesAddEntityButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/KubernetesAddEntityButton';
import KubernetesEntityTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/KubernetesEntityTable';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import { KubernetesEntityType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/utils';
import { getAllKubernetesNamespacesForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesNamespacesForEntitySelection';
import { getAllKubernetesClustersForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesClustersForEntitySelection';
import {
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './KubernetesLimitedAccessPanel.mless';

/**
 * Props for configuring this instance of the component
 */
interface Props<FORM_TYPE extends MapFormItems>
  extends FormControlProps<FORM_TYPE>,
    SlideControlProps<SubSlideConfig> {}

/**
 * Actual component
 * @param param0 props
 * @returns current instance
 */
export default function _KubernetesLimitedAccessPanel<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  setShowSubSlide,
  setSubSlideConfig
}: Props<FORM_TYPE>) {
  const timeConfig = useTimeConfig();
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  if (!permissionSetField?.value) return null;

  const { accessLevelMessage } = getConfigurationSummaryMsg(
    ProductArea.KUBERNETES,
    ScopedPermissionItem.LIMITED_ACCESS
  );

  return (
    <Stack direction="vertical">
      <StackItem>
        <ConfigurationSummary
          accessLevelType={ScopedPermissionItem.LIMITED_ACCESS}
          accessLevelMsg={accessLevelMessage}
        />
      </StackItem>
      <StackItem>
        <div className={locals.contentHeader}>
          <Typography variant="body-bold" component="div">
            {t('in-settings:PermissionSection.limitedAccessKubernetes_namespaces')}
          </Typography>
        </div>
      </StackItem>
      <StackItem>
        <KubernetesAddEntityButton
          addButtonLabel={t('in-settings:PermissionSection.limitedAccessKubernetes_addNamespace')}
          entityType={KubernetesEntityType.Namespace}
          form={form}
          setForm={setForm}
          observable={() => getAllKubernetesNamespacesForEntitySelectionWithDefaults({ timeConfig })}
          setSubSlideConfig={setSubSlideConfig}
          setShowSubSlide={setShowSubSlide}
        />
      </StackItem>
      <KubernetesEntityTable
        entityType={KubernetesEntityType.Namespace}
        form={form}
        observable={() => getAllKubernetesNamespacesForEntitySelectionWithDefaults({ timeConfig })}
        setForm={setForm}
      />
      <StackItem>
        <div className={locals.contentHeader}>
          <Typography variant="body-bold" component="div">
            {t('in-settings:PermissionSection.limitedAccessKubernetes_clusters')}
          </Typography>
        </div>
      </StackItem>
      <StackItem>
        <KubernetesAddEntityButton
          addButtonLabel={t('in-settings:PermissionSection.limitedAccessKubernetes_addCluster')}
          entityType={KubernetesEntityType.Cluster}
          form={form}
          setForm={setForm}
          observable={() => getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig })}
          setSubSlideConfig={setSubSlideConfig}
          setShowSubSlide={setShowSubSlide}
        />
      </StackItem>
      <KubernetesEntityTable
        entityType={KubernetesEntityType.Cluster}
        form={form}
        observable={() => getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig })}
        setForm={setForm}
      />
    </Stack>
  );
}
