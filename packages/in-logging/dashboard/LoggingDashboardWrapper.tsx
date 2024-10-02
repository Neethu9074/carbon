/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Button, SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  dashboardConfigurationPath,
  dashboardDeletePath,
  dashboardSmartAlertsPath,
  loggingDashboardPath
} from 'in-logging/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { logsPathWithDataSource } from 'in-logging/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import { role } from 'in-stores/user';

import locals from './LoggingDashboardWrapper.mless';

interface Props {
  children: ReactNode;
  withPadding?: boolean;
}

function LoggingDashboardWrapper(props: Props) {
  const { children, withPadding = false } = props;

  const { location, createHref, matchLocation } = useNavigation();

  return (
    <>
      <DashboardHeader
        {...props}
        icon="lib_application_logging"
        label={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
        title={t('in-components:mainNavigation.viewSwitcherLabelLogs')}
        renderButtonLine={ButtonLine}
      />
      <DashboardHeaderModule>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: loggingDashboardPath })}
            label={t('in-logging:dashboard.summary')}
            isActive={matchLocation(path => path === loggingDashboardPath)}
          />
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: dashboardSmartAlertsPath })}
            label={t('in-logging:dashboard.smartAlerts')}
            isActive={matchLocation(dashboardSmartAlertsPath)}
          />
          {role?.canDeleteLogs && (
            <SecondLevelNavigationItem
              href={createHref({ ...location, pathname: dashboardDeletePath })}
              label={t('in-logging:dashboard.deleteLogs')}
              isActive={matchLocation(path => path === dashboardDeletePath)}
            />
          )}
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: dashboardConfigurationPath })}
            label={t('in-logging:dashboard.configuration')}
            isActive={matchLocation(path => path === dashboardConfigurationPath)}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
      <section className={classNames(withPadding && locals.content)}>{children}</section>
    </>
  );
}

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
