/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { forwardRef, ForwardedRef, useEffect, useMemo } from 'react';

import { ActionInstance, TimeConfig, ApplicationBoundaryScope } from '@instana/types';
import { themes } from '@instana/design-tokens';

import MarkerLane, { LaneItemProps, MarkerLaneEvent } from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import ActionlaneDialogPresenter from 'in-automation/components/MarkersLane/ActionlaneDialogPresenter';
import { trackMarkerClicked, trackMarkerHovered } from 'in-automation/components/MarkersLane/tracker';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { ActionListCalloutProps } from 'in-automation/components/MarkersLane/shared';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './ActionsLanePresenter.mless';

interface ActionsData {
  readonly actionInstances?: ActionInstance[];
  readonly timestamp: number;
}

export default function ActionsLanePresenter({
  actionInstancesData,
  isLoading,
  timeConfig,
  labels,
  snapshotHostFqdn,
  ...remainingProps
}: {
  actionInstancesData: ActionsData[];
  isLoading: boolean;
  snapshotHostFqdn?: string;
  isClustered?: boolean;
  timeConfig: TimeConfig;
  chartName: string;
  boundaryScope: ApplicationBoundaryScope;
  hasButtonInActionslane?: boolean;
  labels: { applicationLabel: string; serviceLabel?: string; endpointLabel?: string };
}) {
  const { boundaryScope, hasButtonInActionslane } = remainingProps;
  const actionInstances = useMemo(() => {
    return actionInstancesData.map((entry: ActionsData) => ({
      timestamp: entry.timestamp,
      count: entry.actionInstances?.filter((instance: ActionInstance) => instance.status !== 'READY')?.length, // Filter Ready status for turbo instances
      actionInstances: entry.actionInstances?.filter((instance: ActionInstance) => instance.status !== 'READY') ?? [], //filter ready status for turbo instances
      boundaryScope,
      labels: labels,
      hasButtonInActionslane: hasButtonInActionslane,
      snapshotHostFqdn: snapshotHostFqdn
    }));
  }, [actionInstancesData, boundaryScope, labels, snapshotHostFqdn, hasButtonInActionslane]);
  // After filtering instances with ready status, if count become zero, filter the entry.
  const filteredActionInstances = actionInstances.filter(instance => instance.count !== 0);

  return (
    <>
      <MarkerLane<ActionsData>
        events={filteredActionInstances}
        label={t('in-automation:actions')}
        isClustered
        chartContentPosition="pre"
        TooltipContent={({ actionInstances = [] }) => (
          <div className={locals.tooltipContent}>
            {actionInstances.map(({ actionName, startDate, status }, i: number) => (
              <div key={`${startDate}${i}`}>
                <time dateTime={new Date(startDate).toISOString()}>
                  {startDate ? formatDateTime(startDate) : formatDateTime(null)}
                </time>
                <div key={i} className={locals.name}>{`${actionName}`}</div>
                <div key={`status${i}`} className={locals.name}>
                  {status ? getStatus(status) : t('in-automation:actionHistory.unknown')}
                </div>
              </div>
            ))}
          </div>
        )}
        LaneItem={ActionLaneItem}
        HoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
        isLoading={isLoading}
        calloutContent={(props: { eventData: ActionListCalloutProps }) => <ActionListCallout {...props} />}
        timeConfig={timeConfig}
        trackMarkerHoverEvent={eventData => {
          trackMarkerHovered({
            actionNames: eventData.actionInstances?.map(instance => instance.actionName),
            numberOfActions: eventData.actionInstances?.length,
            chartName: remainingProps.chartName
          });
        }}
        {...remainingProps}
      />
    </>
  );
}

function ActionListCallout({ eventData }: { eventData: ActionListCalloutProps }) {
  useEffect(() => {
    // Call addActiveDialog with the ActionlaneDialogPresenter component
    addActiveDialog(<ActionlaneDialogPresenter eventData={eventData} />);
  }, [eventData]);

  // Since we're adding the dialog using addActiveDialog, return null here
  trackMarkerClicked({ actionNames: eventData.actionInstances?.map(instance => instance.actionName) });
  return null;
}

const ActionLaneItem = forwardRef(function ActionLaneItem(
  props: LaneItemProps<MarkerLaneEvent>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <SingleMarkerLaneItem<MarkerLaneEvent>
      ref={ref}
      renderMarkerItem={markerItemProps => (
        <LaneIcon
          {...markerItemProps}
          iconConfig={{
            type: 'lib_actionsLane_actions',
            typeCluster: 'lib_actionsLane_multiple_actions',
            color: themes.default.ids.color.option.blue['500']
          }}
        />
      )}
      {...props}
    />
  );
});
