/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getEcsTaskForEcsContainer from 'in-subscription/getEcsTaskForEcsContainer';
import getRegionForEcsContainer from 'in-subscription/getRegionForEcsContainer';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';
import { Trans } from 'in-i18n';

import locals from './InfrastructureTabSubscript.mless';

const taskArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:task\/([^:]+)/;
const clusterArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:cluster\/([^:]+)/;

export default function InfrastructureTabSubscriptNullChecker(props) {
  if (!props.snapshot) {
    return null;
  }
  return <InfrastructureTabSubscript {...props} />;
}

function InfrastructureTabSubscript({ snapshot, time }) {
  const snapshotId = snapshot.get('id');
  const taskSnapshotId = useObservable(getEcsTaskForEcsContainerObservable, [snapshotId, time]);
  const regionSnapshotId = useObservable(getRegionForEcsContainerObservable, [snapshotId, time]);

  const data = snapshot.get('data');
  if (!data) {
    return null;
  }
  const taskArnFullValue = data.get('taskArn', '?');
  const taskDefinitionFullValue = data.get('taskDefinition', '?');
  const taskDefinitionVersion = data.get('taskDefinitionVersion', '?');
  const clusterArnFullValue = data.get('clusterArn', '?');
  const region = data.get('region', '?');
  const taskArnLabel = getTaskArnLabel(
    taskArnFullValue,
    taskDefinitionFullValue,
    taskSnapshotId,
    taskDefinitionVersion,
    'lib_aws_ecs_task',
    'lib_aws_ecs_task_definition_version'
  );
  const clusterArnLabel = getClusterArnLabel(
    clusterArnFullValue,
    region,
    regionSnapshotId,
    'lib_aws_ecs_cluster',
    'lib_views_cloud'
  );
  return (
    <div className={locals.infrastructureTabSubscript}>
      <div>{taskArnLabel}</div>
      <div>{clusterArnLabel}</div>
    </div>
  );
}

function getTaskArnLabel(arnFullValue, definitionFullValue, snapshotId, version, taskIcon, versionIcon) {
  const definitionShort = shorten(definitionFullValue, 64);
  if (arnFullValue !== '?') {
    const taskAraLabel = abbreviatePart(arnFullValue, taskArnRegex, 10);
    return snapshotId ? (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptInWithAbbrSnapshotId"
        values={{
          taskLabel: taskAraLabel,
          definition: definitionShort,
          taskDefinitionVersion: version
        }}
        components={{
          taskIcon: <Icon type={taskIcon} />,
          taskLink: <Link href$={subscriptLink(snapshotId)} className={locals.entityLink} />,
          titledTask: <span title={arnFullValue} />,
          versionIcon: <Icon type={versionIcon} />,
          titledDefinition: <span title={definitionFullValue} />
        }}
      />
    ) : (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptInWithAbbr"
        values={{
          taskLabel: taskAraLabel,
          definition: definitionShort,
          taskDefinitionVersion: version
        }}
        components={{
          titledTask: <span title={arnFullValue} />,
          versionIcon: <Icon type={versionIcon} />,
          titledDefinition: <span title={definitionFullValue} />
        }}
      />
    );
  } else {
    return snapshotId ? (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptInWithSnapshotId"
        values={{
          taskLabel: arnFullValue,
          definition: definitionShort,
          taskDefinitionVersion: version
        }}
        components={{
          taskIcon: <Icon type={taskIcon} />,
          taskLink: <Link href$={subscriptLink(snapshotId)} className={locals.entityLink} />,
          versionIcon: <Icon type={versionIcon} />,
          titledDefinition: <span title={definitionFullValue} />
        }}
      />
    ) : (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptIn"
        values={{
          taskLabel: arnFullValue,
          definition: definitionShort,
          taskDefinitionVersion: version
        }}
        components={{
          versionIcon: <Icon type={versionIcon} />,
          titledDefinition: <span title={definitionFullValue} />
        }}
      />
    );
  }
}
function getClusterArnLabel(clusterArnFull, region, snapshotId, clusterIcon, cloudIcon) {
  if (clusterArnFull !== '?') {
    const shortClusterValue = abbreviatePart(clusterArnFull, clusterArnRegex, 32);
    return snapshotId ? (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptOnWithAbbrSnapshotId"
        values={{
          clusterArn: shortClusterValue,
          region: region
        }}
        components={{
          clusterIcon: <Icon type={clusterIcon} />,
          titledSpan: <span title={clusterArnFull} />,
          cloudIcon: <Icon type={cloudIcon} />,
          regionLink: <Link href$={subscriptLink(snapshotId)} className={locals.entityLink} />
        }}
      />
    ) : (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptOnWithAbbr"
        values={{
          clusterArn: shortClusterValue,
          region: region
        }}
        components={{
          clusterIcon: <Icon type={clusterIcon} />,
          titledSpan: <span title={clusterArnFull} />
        }}
      />
    );
  } else {
    return snapshotId ? (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptOnWithSnapshotId"
        values={{
          clusterArn: clusterArnFull,
          region: region
        }}
        components={{
          clusterIcon: <Icon type={clusterIcon} />,
          cloudIcon: <Icon type={cloudIcon} />,
          regionLink: <Link href$={subscriptLink(snapshotId)} className={locals.entityLink} />
        }}
      />
    ) : (
      <Trans
        i18nKey="in-forge:plugins.awsEcsContainer.infraTabSubscriptOn"
        values={{
          clusterArn: clusterArnFull,
          region: region
        }}
        components={{
          clusterIcon: <Icon type={clusterIcon} />
        }}
      />
    );
  }
}

function abbreviatePart(fullValue, regex, length = 10) {
  const match = regex.exec(fullValue);
  return shorten(match?.[1] ?? fullValue, length);
}

function subscriptLink(snapshotId) {
  return getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
}

function Icon({ type }) {
  return <SvgIcon className={locals.entitiyIcon} type={type} size="s" />;
}

function getEcsTaskForEcsContainerObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getEcsTaskForEcsContainer({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}

function getRegionForEcsContainerObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getRegionForEcsContainer({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}
