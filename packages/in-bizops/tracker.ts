/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  BIZOPS_TAB_CLICK,
  BIZOPS_PROCESSES_LIST_SELECT,
  BIZOPS_PERSPECTIVES_LIST_SELECT,
  BIZOPS_ANALYZE_INSTANCES_CLICK,
  BIZOPS_VIEW_ALL_ACTIVITIES_CLICK,
  BIZOPS_ACTIVITY_SELECT,
  BIZOPS_CREATE_PERSPECTIVE_CLICK,
  BIZOPS_PERSPECTIVE_CREATED,
  BIZOPS_BREADCRUMB_CLICK,
  BIZOPS_DEPLOY_AGENT_CLICK
} from 'in-services/tracking/tracking';
import { CREATED_OBJECT, CTA_CLICKED, UI_INTERACTION } from 'in-services/util/constants';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { EventTrackerProps } from 'in-services/tracking/segment/types';

// Baseline generic event interfaces to be extended
interface UiInteractionProps {
  path: string;
}

interface CtaClickedProps {
  path: string;
}

interface CreatedObjectProps {
  path: string;
  successFlag: boolean;
  errorMessage?: string[];
}

function bizopsEventTracker(
  props: UiInteractionProps | CtaClickedProps | CreatedObjectProps,
  segmentEventName: string
) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const data = {
    ...props,
    parentPageCategory: productArea,
    parentPageName: pageRootName
  } as EventTrackerProps['data'];
  eventTracker({ data, segmentEventName: segmentEventName });
}

// ********************************

interface bizopsTabClickProps extends UiInteractionProps {
  tab: string;
}

export const bizopsTabClick = (props: bizopsTabClickProps) => {
  const data = {
    ...props,
    action: BIZOPS_TAB_CLICK
  };
  bizopsEventTracker(data, UI_INTERACTION);
};

// ********************************

interface bizopsProcessesListSelectProps extends UiInteractionProps {
  processId: string;
  processName: string;
}

export const bizopsProcessesListSelect = (props: bizopsProcessesListSelectProps) => {
  const data = {
    ...props,
    action: BIZOPS_PROCESSES_LIST_SELECT
  };
  bizopsEventTracker(data, UI_INTERACTION);
};

// ********************************

interface bizopsPerspectivesListSelectProps extends UiInteractionProps {
  perspectiveId: string;
  perspectiveName: string;
}

export const bizopsPerspectivesListSelect = (props: bizopsPerspectivesListSelectProps) => {
  const data = {
    ...props,
    action: BIZOPS_PERSPECTIVES_LIST_SELECT
  };
  bizopsEventTracker(data, UI_INTERACTION);
};

// ********************************

interface bizopsAnalyzeInstancesProps extends CtaClickedProps {
  processId: string;
  processName: string;
  activityName?: string;
}

export const bizopsAnalyzeInstancesClick = (props: bizopsAnalyzeInstancesProps) => {
  const data = {
    ...props,
    CTA: BIZOPS_ANALYZE_INSTANCES_CLICK
  };
  bizopsEventTracker(data, CTA_CLICKED);
};

// ********************************

interface bizopsViewAllActivitiesClickedProps extends CtaClickedProps {
  processId: string;
  processName: string;
}

export const bizopsViewAllActivitiesClick = (props: bizopsViewAllActivitiesClickedProps) => {
  const data = {
    ...props,
    CTA: BIZOPS_VIEW_ALL_ACTIVITIES_CLICK
  };
  bizopsEventTracker(data, CTA_CLICKED);
};

// ********************************

interface bizopsActivitySelectProps extends UiInteractionProps {
  processId: string;
  processName: string;
  activityName: string;
}

export const bizopsActivitySelect = (props: bizopsActivitySelectProps) => {
  const data = {
    ...props,
    action: BIZOPS_ACTIVITY_SELECT
  };
  bizopsEventTracker(data, UI_INTERACTION);
};

// ********************************

interface bizopsCreatePerspectiveClickProps extends CtaClickedProps {
  // Kept in case we want to extend this to include fields in the future.
}

export const bizopsCreatePerspectiveClick = (props: bizopsCreatePerspectiveClickProps) => {
  const data = {
    ...props,
    CTA: BIZOPS_CREATE_PERSPECTIVE_CLICK
  };
  bizopsEventTracker(data, CTA_CLICKED);
};

// ********************************

interface bizopsPerspectiveCreatedProps extends CreatedObjectProps {
  perspectiveId?: string; // will only be included if the creation was a success
  perspectiveName: string;
}

export const bizopsPerspectiveCreated = (props: bizopsPerspectiveCreatedProps) => {
  const data = {
    ...props,
    objectType: BIZOPS_PERSPECTIVE_CREATED,
    process: 'creation'
  };
  bizopsEventTracker(data, CREATED_OBJECT);
};

// ********************************

interface bizopsBreadcrumbClickProps extends UiInteractionProps {
  perspectiveId?: string;
  perspectiveName?: string;
  activityName?: string;
}

export const bizopsBreadcrumbClick = (props: bizopsBreadcrumbClickProps) => {
  const data = {
    ...props,
    action: BIZOPS_BREADCRUMB_CLICK
  };
  bizopsEventTracker(data, UI_INTERACTION);
};

// ********************************

interface bizopsDeployAgentClickProps extends CtaClickedProps {
  location: string;
}

export const bizopsDeployAgentClick = (props: bizopsDeployAgentClickProps) => {
  const data = {
    ...props,
    CTA: BIZOPS_DEPLOY_AGENT_CLICK
  };
  bizopsEventTracker(data, CTA_CLICKED);
};
