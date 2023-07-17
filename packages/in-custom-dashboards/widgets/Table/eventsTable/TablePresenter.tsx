/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

//@ts-expect-error TS migration
import EventsList from 'in-events/components/EventsList';
import { ShowcaseProps } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { RawEvent, TimeConfig } from 'in-types';

import locals from './TablePresenter.mless';

interface TableOverviewBehaviourProps {
  isPreview: boolean;
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  config?: object;
}
// NP: 'rawEventList' | 'timeConfig' | 'headers' | 'loadMoreShowcaseData' | 'canLoadMore' These properties are required, and when the functionality 'TableOverviewBehaviour' is implemented, this TablePresenterProps interface can be reused.

export default function TableOverviewBehaviour(props: TableOverviewBehaviourProps) {
  const timeConfig = useTimeConfig();

  return <TablePresenter {...props} rawEventList={[]} timeConfig={timeConfig} />;
}

export interface TablePresenterProps {
  rawEventList?: RawEvent[] | ShowcaseProps[];
  headers?: string[];
  timeConfig: TimeConfig;
  isPreview: boolean;
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  loadMoreShowcaseData?: VoidFunction;
  canLoadMore?: boolean;
  config?: object;
}

export const TablePresenter = ({
  rawEventList,
  headers,
  timeConfig,
  isPreview,
  title,
  dragHandle,
  actions,
  loadMoreShowcaseData,
  canLoadMore
}: TablePresenterProps) => {
  const props = {
    items: rawEventList,
    headers: headers,
    timeConfig: timeConfig,
    canLoadMore: canLoadMore,
    onItemClicked: onItemClicked,
    progress: { loading: false },
    loadMore: isPreview ? loadMoreShowcaseData : loadMore,
    isPreview
  };

  return (
    <Card
      title={title}
      useMaxAvailableHeight={!isPreview}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
    >
      {rawEventList && (
        <>
          <div className={[locals.container, isPreview ? locals.heightAuto : undefined].join(' ')}>
            <EventsList {...props} />
          </div>
        </>
      )}
    </Card>
  );
};

function onItemClicked(_eventId: string) {
  // Handle redirect event
}

function loadMore() {
  // to load actual data
}
