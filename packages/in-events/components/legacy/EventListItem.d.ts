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
  isRCA: boolean;
}

export default function EventListItem(props: EventListItemProps): JSX.Element;
