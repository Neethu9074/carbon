/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { subtraceDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import subtraceTabs from 'in-applications/Dashboards/subtrace/tabs';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { useSubtrace } from 'in-applications/hooks/useSubtrace';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';

export default function SubtraceDashboard() {
  const location = useLocation();
  const [{ subtraceId }] = useUrlState({ bind: [subtraceDashboardUrlParameters.subtraceId] });

  const subtrace = useSubtrace(subtraceId);

  return (
    <>
      <TabView
        location={location}
        HeaderComponent={() => (
          <DashboardHeader
            title={t('in-applications:subtraces.labelSubtrace')}
            label={subtrace.data?.name ?? ''}
            icon="lib_application"
            result={subtrace}
          />
        )}
        tabs={subtraceTabs}
        props={subtrace}
      />
      <Footer />
    </>
  );
}
