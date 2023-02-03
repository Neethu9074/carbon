/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';

type PermissionSetResultFilterArea = keyof typeof types;

interface WebsiteProps {
  checkIfSelected: (websiteId: string) => boolean;
  toggleItem: (websiteId: string, area: PermissionSetResultFilterArea) => void;
}

declare const Website: React.SFC<WebsiteProps>;

export default Website;
