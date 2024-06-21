/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react'

import { teamSettingsLogManagementIntegrations } from 'in-settings/navigation/paths';
// @ts-ignore
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

import locals from './Integrations.mless';

export default function IntegrationsBreadcrumb(){

  const {goToPath} = useNavigation()

  return(
    <Breadcrumb className={locals.breadcrumb} onClick={() => goToPath(teamSettingsLogManagementIntegrations)}>Integrations /</Breadcrumb>
  )
}
