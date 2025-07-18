/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import type { TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

// @ts-expect-error needs migration
import zoomInAction from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import useGetHrefToHighlightedTimeFrame from 'in-service-levels/navigation/hooks/useGetHrefToHighlightedTimeFrame';
import type { ContextMenuButton } from 'in-components/Chart/types';

export default function useSloZoomInAction(): ContextMenuButton {
  const getZoomHref = useGetHrefToHighlightedTimeFrame();

  return {
    name: 'sloZoomIn',
    icon: zoomInAction.icon,
    label: zoomInAction.label,
    onClick: zoomInAction.onClick,
    allowClickPropagationAndDefault: true,
    getHref$: (highlightedTimeFrame?: TimeConfig) => just(getZoomHref(highlightedTimeFrame))
  };
}
