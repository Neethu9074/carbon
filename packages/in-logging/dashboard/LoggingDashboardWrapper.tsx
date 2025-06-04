/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Button, Link, SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import LoggingPermissionWrapper from 'in-logging/navigation/LoggingPermissionWrapper';
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLoggingNavigationItems } from 'in-logging/dashboard/utils';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { logsPathWithDataSource } from 'in-logging/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import Sticky from 'in-components/Sticky/Sticky';

import locals from './LoggingDashboardWrapper.mless';

interface Props extends DashboardHeaderProps {
  children: ReactNode;
  withPadding?: boolean;
}
interface DashboardHeaderProps {
  title?: string;
  withTabs?: boolean;
  withButton?: boolean;
  withTimeSelection?: boolean;
}

function LoggingDashboardWrapper({
  children,
  title,
  withPadding = false,
  withTabs = true,
  withButton = true,
  withTimeSelection = true
}: Props) {
  return (
    <LoggingPermissionWrapper
      requiredPermission="canViewLogs"
      permissionLabel={t('in-stores:permissionCanViewLogsLabel')}
    >
      <Sticky
        header={
          <LoggingDashboardHeader
            title={title}
            withTabs={withTabs}
            withButton={withButton}
            withTimeSelection={withTimeSelection}
          />
        }
      >
        <section
          aria-label={t('in-components:pageStructure.contentAriaLabel')}
          className={classNames(withPadding && locals.content)}
        >
          {children}
        </section>
      </Sticky>
    </LoggingPermissionWrapper>
  );
}

const LoggingDashboardHeader = ({
  title = t('in-components:mainNavigation.viewSwitcherLabelLogs'),
  withTabs,
  withButton,
  withTimeSelection
}: DashboardHeaderProps) => {
  const { location, createHref, matchLocation } = useNavigation();
  const loggingNavigationItems = useLoggingNavigationItems();
  const { trackClickedDocsLink } = useAnalyzeTracker();

  return (
    <>
      <DashboardHeader
        icon="lib_application_logging"
        label={title}
        title={title}
        {...(withButton && { renderButtonLine: ButtonLine })}
        ariaLabel={t('in-components:pageStructure.headerAriaLabel')}
        {...(!withTimeSelection && { renderTimeSelection: () => null })}
        renderMetaInformation={() => (
          <Link onClick={trackClickedDocsLink} external href={analyzeDocs.logsHomepage}>
            {t('in-analyze:analyzeHeader.readDocs')}
          </Link>
        )}
      />
      {withTabs && (
        <DashboardHeaderModule>
          <SecondLevelNavigation aria-label={t('in-components:pageStructure.pageTabsAriaLabel')}>
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
      )}
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
