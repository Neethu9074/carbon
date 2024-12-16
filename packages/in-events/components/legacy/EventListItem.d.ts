/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

interface EventListItemProps {
  triggeringProblemId?: string;
  event: Map;
  background?: string;
  latestSnapshot: Map;
  setBackground?: string;
  setIconColor?: string;
  expandedFromTimeline?: boolean;
  setExpandedEventOnClickInTimeline?: (expandedId: string) => void;
  highlightEventOnHover?: boolean;
}

export default function EventListItem(props: EventListItemProps): JSX.Element;
