/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

//@ts-expect-error TS migration
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
//@ts-expect-error TS migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import getKubernetesPersistentVolumeClaim from 'in-kubernetes/subscriptions/getKubernetesPersistentVolumeClaim';
//@ts-expect-error TS migration
import { PersistentVolumeClaimBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import { persistentVolumeClaimId as matrixPersistentVolumeClaimId } from 'in-kubernetes/navigation/matrix';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
//@ts-expect-error TS migration
import EntityVersionList from 'in-components/EntityVersionList';
//@ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { KubernetesPersistentVolumeClaim, Nullish, Result, TimeConfig } from 'in-types';
import { persistentVolumeClaimDashboard } from 'in-kubernetes/navigation/paths';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { TrackingFunction, useKubernetesTracker } from 'in-kubernetes/tracker';
import tabs from 'in-kubernetes/Dashboards/PersistentVolumeClaim/tabs/index';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface PersistentVolumeClaimProps {
  persistentVolumeClaimId: string | null | undefined;
  timeConfig: TimeConfig;
  viewPath: string;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}

export default function PersistentVolumeClaimDashboard({ location }: Readonly<{ location: Location }>) {
  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  const props: PersistentVolumeClaimProps = {
    persistentVolumeClaimId: getMatrixParameter(
      location,
      persistentVolumeClaimDashboard,
      matrixPersistentVolumeClaimId
    ),
    viewPath: persistentVolumeClaimDashboard,
    timeConfig: getTimeConfig(location),
    kubernetesTimeShiftSelectTracker
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.persistent_volume_claim_summary
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        persistentVolumeClaimId={props.persistentVolumeClaimId}
        renderBreadcrumbs={(clusterId: string, namespaceId: string) => (
          <Breadcrumbs
            items={PersistentVolumeClaimBreadcrumbs({
              ...props,
              clusterId,
              namespaceId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesPersistentVolumeClaim({
          id: props.persistentVolumeClaimId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={e => {
          k8sTabChange({
            ...e,
            dashboard: 'persistentVolumeClaim',
            path: location.pathname
          });
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesPersistentVolumeClaim}
              snapshotId={props.persistentVolumeClaimId}
              timeConfig={props.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </>
  );
}

function Header(
  props: Readonly<PersistentVolumeClaimProps> & { result: Result<KubernetesPersistentVolumeClaim> | Nullish }
) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-kubernetes:dashboards.kubernetesPersistentVolumeClaim')}
      icon="lib_infra_kubernetesPersistentVolumeClaim"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={RenderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={RenderMetaInformation}
    />
  );
}

function RenderButtonLine({
  persistentVolumeClaimId,
  timeConfig,
  result
}: Readonly<{
  persistentVolumeClaimId: string;
  timeConfig: TimeConfig;
  result: Result<KubernetesPersistentVolumeClaim>;
}>) {
  return (
    <DashboardButtonLine
      snapshotId={persistentVolumeClaimId ?? ''}
      timeConfig={timeConfig}
      plugin={plugins.kubernetesPersistentVolumeClaim}
      tagFilters={[
        //@ts-expect-error TS migration
        { name: 'kubernetes.persistentvolumeclaim.name', value: result.data?.name, operator: 'EQUALS' }
      ]}
    />
  );
}

function renderButtonLineSecondary({
  persistentVolumeClaimId,
  timeConfig,
  kubernetesTimeShiftSelectTracker
}: Readonly<{
  persistentVolumeClaimId: string;
  timeConfig: TimeConfig;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}>) {
  return (
    <>
      <TimeShiftDropdown
        onChange={offset =>
          kubernetesTimeShiftSelectTracker({
            area: 'persistentVolumeClaim',
            offset: getTimeShiftLabel({ offset: offset }),
            windowSize: timeConfig.windowSize,
            autoRefresh: timeConfig.autoRefresh
          })
        }
        disabled={!beeInstanaInfraMetricsEnabled || !beeinstanaInfraMetricsWithTimeshiftEnabled}
      />
      <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={persistentVolumeClaimId} />
    </>
  );
}

function RenderMetaInformation({
  result
}: Readonly<{
  result: Result<KubernetesPersistentVolumeClaim>;
}>) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {
        //@ts-expect-error TS migration
        version && <BadgeList type={version} getColor={() => 'blue'} />
      }
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SPersistentVolumeClaim')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
