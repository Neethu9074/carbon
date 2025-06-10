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
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
//@ts-expect-error TS migration
import { PersistentVolumeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import getKubernetesPersistentVolume from 'in-kubernetes/subscriptions/getKubernetesPersistentVolume';
import { persistentVolumeId as matrixPersistentVolumeId } from 'in-kubernetes/navigation/matrix';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
//@ts-expect-error TS migration
import EntityVersionList from 'in-components/EntityVersionList';
//@ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { KubernetesPersistentVolume, Nullish, Result, TimeConfig } from 'in-types';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { TrackingFunction, useKubernetesTracker } from 'in-kubernetes/tracker';
import { persistentVolumeDashboard } from 'in-kubernetes/navigation/paths';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import tabs from 'in-kubernetes/Dashboards/PersistentVolume/tabs/index';
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

interface PersistentVolumeProps {
  persistentVolumeId: string | null | undefined;
  timeConfig: TimeConfig;
  viewPath: string;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}

export default function PersistentVolumeDashboard({ location }: Readonly<{ location: Location }>) {
  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  const props: PersistentVolumeProps = {
    persistentVolumeId: getMatrixParameter(location, persistentVolumeDashboard, matrixPersistentVolumeId),
    viewPath: persistentVolumeDashboard,
    timeConfig: getTimeConfig(location),
    kubernetesTimeShiftSelectTracker
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.persistent_volume_summary
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        persistentVolumeId={props.persistentVolumeId}
        renderBreadcrumbs={(clusterId: string) => (
          <Breadcrumbs
            items={PersistentVolumeBreadcrumbs({
              ...props,
              clusterId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesPersistentVolume({
          id: props.persistentVolumeId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={e => {
          k8sTabChange({
            ...e,
            dashboard: 'persistentVolume',
            path: location.pathname
          });
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesPersistentVolume}
              snapshotId={props.persistentVolumeId}
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

function Header(props: Readonly<PersistentVolumeProps> & { result: Result<KubernetesPersistentVolume> | Nullish }) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-kubernetes:dashboards.kubernetesPersistentVolume')}
      icon="lib_infra_kubernetesPersistentVolume"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={RenderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={RenderMetaInformation}
    />
  );
}

function RenderButtonLine({
  persistentVolumeId,
  timeConfig,
  result
}: Readonly<{
  persistentVolumeId: string;
  timeConfig: TimeConfig;
  result: Result<KubernetesPersistentVolume>;
}>) {
  return (
    <DashboardButtonLine
      snapshotId={persistentVolumeId ?? ''}
      timeConfig={timeConfig}
      plugin={plugins.kubernetesPersistentVolume}
      tagFilters={[
        //@ts-expect-error TS migration
        { name: 'kubernetes.persistentvolume.name', value: result.data?.name, operator: 'EQUALS' },
        //@ts-expect-error TS migration
        { name: 'kubernetes.cluster.name', value: result.data?.clusterId, operator: 'EQUALS' }
      ]}
    />
  );
}

function renderButtonLineSecondary({
  persistentVolumeId,
  timeConfig,
  kubernetesTimeShiftSelectTracker
}: Readonly<{
  persistentVolumeId: string;
  timeConfig: TimeConfig;
  kubernetesTimeShiftSelectTracker: TrackingFunction;
}>) {
  return (
    <>
      <TimeShiftDropdown
        onChange={offset =>
          kubernetesTimeShiftSelectTracker({
            area: 'persistentVolume',
            offset: getTimeShiftLabel({ offset: offset }),
            windowSize: timeConfig.windowSize,
            autoRefresh: timeConfig.autoRefresh
          })
        }
        disabled={!beeInstanaInfraMetricsEnabled || !beeinstanaInfraMetricsWithTimeshiftEnabled}
      />
      <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={persistentVolumeId} />
    </>
  );
}

function RenderMetaInformation({
  result
}: Readonly<{
  result: Result<KubernetesPersistentVolume>;
}>) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {
        //@ts-expect-error TS migration
        version && <BadgeList type={version} getColor={() => 'blue'} />
      }
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SPersistentVolume')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
