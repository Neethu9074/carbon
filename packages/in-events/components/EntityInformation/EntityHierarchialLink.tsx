/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

import { CarbonButton, Link, Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import { useGetDashboardLink, useGetLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { getPhysicalHierarchy, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
//@ts-expect-error
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import EntityHierarchy from 'in-events/components/EntityInformation/EntityHierarchy';
//@ts-expect-error
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './EntityHierarchicalLink.mless';

type EventPlaceholder = {
  stopPropagation: () => void;
  preventDefault: () => void;
};
interface EntityHierarchicalLinkProps {
  getLabel?: (label: string) => string;
  kind?: string;
  pathname?: string;
  timeConfig: TimeConfig;
  snapshot: { [index: string]: any };
  useSnapshotLink?: boolean;
  calculateHierarchy?: boolean;
  onClose: () => void;
  isCveRedirect?: boolean;
}

export default function EntityHierarchicalLink({
  getLabel,
  kind,
  pathname,
  timeConfig: originalTimeConfig,
  snapshot,
  useSnapshotLink,
  calculateHierarchy,
  onClose,
  isCveRedirect
}: EntityHierarchicalLinkProps) {
  const [isExpanded, setExpanded] = useState(false);

  const snapshotId = snapshot.get('id');

  //@ts-expect-error type `null` and `undefined` is not accepted for timeConfig
  const timeConfig: TimeConfig = useObservable(
    () =>
      shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId, timeConfig: originalTimeConfig }).map(
        (stay: boolean) => (stay ? originalTimeConfig : undefined)
      ),
    [snapshotId, originalTimeConfig]
  );

  const dashboardLink = useGetDashboardLink()(snapshotId, { pathname, timeConfig });
  const snapshotLink = useGetLinkToSnapshotInCurrentView(snapshotId, { timeConfig });

  const href = useSnapshotLink ? snapshotLink : dashboardLink;

  const $hierarchy = useMemo(
    () => (calculateHierarchy ? getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig }) : alwaysNull),
    [snapshotId, timeConfig, calculateHierarchy]
  );

  const hierarchy = useObservable($hierarchy, [snapshotId, timeConfig, calculateHierarchy]);

  const label = getSnapshotLabel(snapshot);

  const close = (e: EventPlaceholder) => {
    onClose();
    e.stopPropagation();
  };

  const link = (
    <Link href={href} onClick={e => (isCveRedirect ? close(e) : noop)} className={locals.link}>
      <Stack align="center" gap="xsmall" direction="horizontal">
        <HealthyPluginIcon snapshot={snapshot} size="s" />
        {getLabel ? getLabel(label) : label}
      </Stack>
    </Link>
  );

  if (!hierarchy || hierarchy.size < 2) {
    return link;
  }
  return (
    <div className={locals.container}>
      {link}
      {isExpanded && (
        <EntityHierarchy
          hierarchy={hierarchy}
          kind={kind}
          useSnapshotLink={useSnapshotLink}
          pathname={pathname}
          timeConfig={timeConfig}
          isCveRedirect={isCveRedirect}
          onClose={onClose}
          filterId={snapshotId}
        />
      )}
      <ShowHideButton setExpanded={setExpanded} isExpanded={isExpanded} />
    </div>
  );
}

interface ShowHideButtonProps {
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
}

function ShowHideButton({ setExpanded, isExpanded }: ShowHideButtonProps) {
  return (
    <CarbonButton
      className={locals.ghostBtn}
      kind="ghost"
      size="sm"
      onClick={() => (!isExpanded ? setExpanded(true) : setExpanded(false))}
      renderIcon={() => (
        <SvgIcon type={!isExpanded ? 'lib_openclose_add_box' : 'lib_openclose_remove_circle_outline'} size="s" />
      )}
    >
      {!isExpanded ? t('in-events:viewMore') : t('in-events:viewless')}
    </CarbonButton>
  );
}
