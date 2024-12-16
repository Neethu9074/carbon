/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ListForm, MapForm, Path } from 'formalistic';

import { UserSentState } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { Location } from 'in-stores/navigation/types';

export interface FieldsProps {
  children: JSX.Element | JSX.Element[] | string;
  helpText?: JSX.Element | string | null;
  helpTextIcon?: JSX.Element | null;
  className?: string;
}

export interface UserResultProp {
  id: string;
  email: string;
}

export interface ShortUrlProps {
  data?: { shortUrl: string };
  errors: [];
  progress: { loading: boolean };
  time?: number;
}

export interface UnitKeysProps {
  agentKey: string;
  downloadKey: string;
}

export interface UserInvite {
  groupId: string;
  email: string;
  message?: string;
  path?: string;
  pageName?: string | null;
  userSentState: UserSentState;
}

export interface ShareAndInviteDialogBoxProps {
  /**
   * Only show the invite section, otherwise show both the invite and share.
   */
  inviteOnly?: boolean;
  /**
   * Permission to show the invite section.
   *
   * we don't want to show the invite section if the user :
   * 1. Doesn't have the right to invite
   * 2. play with is enabled
   */
  permissionToShowInvite?: boolean;
}

export interface OnSubmitProps {
  canSelectGroup: boolean;
  form: ListForm<any>;
  setForm: any;
  groups: any;
  emailMessage: string;
  inviteOnly: boolean | undefined;
  createHref: (target: Location) => string;
  clonedLocation: Location;
  productArea: string | null;
  setMessage: React.Dispatch<
    React.SetStateAction<
      | {
          type: 'error' | 'success';
          text: string;
        }
      | undefined
    >
  >;
  setInvitationResult: React.Dispatch<React.SetStateAction<UserInvite[]>>;
  trackCta: CtaTrackingFunction;
}

export interface OnRemoveProps {
  index: number;
  form: ListForm<any>;
  setForm: any;
}

export interface OnChangeProps {
  index: number | string;
  path: Path<any>;
  value: any;
  invite: MapForm<any>;
  form: ListForm<any>;
  setForm: any;
  pendingInvitations: any;
  users: any;
  invitationResult: UserInvite[];
}
