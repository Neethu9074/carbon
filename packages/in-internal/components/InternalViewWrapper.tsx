/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { locationWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import DashboardHeaderContext from 'in-components/DashboardHeader/DashboardHeaderContext';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './InternalViewWrapper.mless';

export default function InternalViewWrapper({ children }: { children: React.ReactElement }) {
  const { location, createHref } = useNavigation();
  const targetLocation = locationWithoutQueryParameter({ ...location, pathname: '/internal' });
  function renderContext() {
    return (
      <DashboardHeaderContext
        href={createHref(targetLocation)}
        label={t('in-internal:components.internalViewWrapper.internal')}
      />
    );
  }
  return (
    <Sticky
      header={
        <DashboardHeader
          title={t('in-internal:components.internalViewWrapper.internal')}
          contextConfigurations={[{ renderContext, contextIcon: 'lib_flame' }]}
        />
      }
    >
      <div className={locals.body}>{children}</div>
    </Sticky>
  );
}
