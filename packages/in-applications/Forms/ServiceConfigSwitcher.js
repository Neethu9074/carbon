/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { newServiceView, configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import { SideNavigation, SideNavigationItem } from 'in-components/SideNavigation';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

export default function ServiceConfigSwitcher() {
  const { location, matchLocation, createHref } = useNavigation();

  return (
    <SideNavigation title={t('in-applications:titleConfigure')}>
      <SideNavigationItem
        href={createHref({ ...location, pathname: newServiceView })}
        icon="lib_application_service"
        label={t('in-applications:labelCustomServiceRules')}
        isActive={matchLocation(newServiceView)}
      />
      <SideNavigationItem
        href={createHref({ ...location, pathname: configureSyntheticEndpointsView })}
        icon="lib_application_endpoint"
        label={t('in-applications:labelSyntheticEndpoints')}
        isActive={matchLocation(configureSyntheticEndpointsView)}
      />
    </SideNavigation>
  );
}
