/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { UserGoal } from 'in-plg/pages/UserGoalSelection/types';

export const TOGGLER = 'toggler';

export const GOALS: UserGoal[] = [
  {
    id: 'goal_1',
    icon: 'lib_website',
    text: 'Improve website and API performance management'
  },
  {
    id: 'goal_2',
    icon: 'lib_application',
    text: 'Manage performance for agent based applications'
  },
  {
    id: 'goal_3',
    icon: 'lib_application_call',
    text: 'Manage performance for OpenTelemetry based applications'
  },
  {
    id: 'goal_4',
    icon: 'lib_infrastructure',
    text: 'Manage your infrastructure'
  },
  {
    id: 'goal_5',
    icon: 'lib_actions_debug',
    text: 'Debug applications'
  },
  {
    id: 'goal_6',
    icon: 'lib_bizops',
    text: 'Monitor your business processes'
  },
  {
    id: 'goal_7',
    icon: 'lib_help_error_help_outline',
    text: 'Other goals',
    type: TOGGLER
  }
];

export const OTHER_GOAL_MAX_LENGTH = 150;

export const GOAL_SELECTION = {
  SEGMENT_MESSAGE: {
    SKIP: 'User goal selection skipped',
    CLOSE: 'User goal selection closed'
  }
};
