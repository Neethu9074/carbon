/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Button, SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import LoggingPermissionWrapper from 'in-logging/navigation/LoggingPermissionWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLoggingNavigationItems } from 'in-logging/dashboard/utils';
import { logsPathWithDataSource } from 'in-logging/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky/Sticky';

import locals from './LoggingDashboardWrapper.mless';

interface Props {
  children: ReactNode;
  withPadding?: boolean;
}

function LoggingDashboardWrapper({ children, withPadding = false }: Props) {
  return (
    <LoggingPermissionWrapper
      requiredPermission="canViewLogs"
      permissionLabel={t('in-stores:permissionCanViewLogsLabel')}
    >
      <Sticky header={<LoggingDashboardHeader />}>
        <section aria-label="Content" className={classNames(withPadding && locals.content)}>
          {children}
        </section>
      </Sticky>
    </LoggingPermissionWrapper>
  );
}

const LoggingDashboardHeader = () => {
  const { location, createHref, matchLocation } = useNavigation();
  const loggingNavigationItems = useLoggingNavigationItems();

  return (
    <>
      <DashboardHeader
        icon="lib_application_logging"
        label={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
        title={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
        renderButtonLine={ButtonLine}
        ariaLabel={'Page Header'}
      />
      <DashboardHeaderModule>
        <SecondLevelNavigation aria-label={'Page tabs'}>
          {loggingNavigationItems.map(
            ({ path, label, currentTab, isTabAllowed = true }) =>
              isTabAllowed && (
                <SecondLevelNavigationItem
                  key={path}
                  href={createHref({ ...location, pathname: path })}
                  label={label}
                  isActive={matchLocation(currentTab)}
                />
              )
          )}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
};

function ButtonLine() {
  const { createHrefToPath } = useNavigation();
  const goToLogs = createHrefToPath(logsPathWithDataSource);

  return (
    <section className={locals.headerButtonsContainer}>
      <Button kind="primary" icon="lib_application_logging" href={goToLogs}>
        {t('in-logging:dashboard.analyzeLogs')}
      </Button>
    </section>
  );
}

export default LoggingDashboardWrapper;
