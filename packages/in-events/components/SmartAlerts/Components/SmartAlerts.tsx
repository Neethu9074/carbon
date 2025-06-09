/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error TS migration
import GlobalApplicationSmartAlerts from 'promise-loader?global,APsmartAlert!in-events/components/SmartAlerts/Components/Application/GlobalApplicationSmartAlerts';
//@ts-expect-error TS migration
import ApplicationSmartAlerts from 'promise-loader?global,localApplicationSmartAlerts!in-events/components/SmartAlerts/Components/Application/ApplicationAlerts';
//@ts-expect-error TS migration
import SyntheticSmartAlerts from 'promise-loader?global,syntheticsSmartAlerts!in-synthetics/dashboards/global/SmartAlertList';
//@ts-expect-error TS migration
import MobileAppSmartAlerts from 'promise-loader?global,mobileAppSmartAlerts!in-alerting/smart-alerts/mobileApp/Alerts';
//@ts-expect-error TS migration
import InfraSmartAlerts from 'promise-loader?global,infraSmartAlerts!in-alerting/smart-alerts/infrastructure/Alerts';
//@ts-expect-error TS migration
import WebsiteSmartAlerts from 'promise-loader?global,websiteSmartAlerts!in-alerting/smart-alerts/websites/Alerts';
//@ts-expect-error TS migration
import LogsSmartAlerts from 'promise-loader?global,logsSmartAlerts!in-alerting/smart-alerts/logs/Alerts';
import React, { useEffect, useState } from 'react';

import { CarbonTab, CarbonTabList, CarbonTabPanels, CarbonTabs } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  globalSmartAlerts,
  smartAlerts,
  infraAlerts,
  syntheticAlerts,
  logAlerts,
  websiteAlerts,
  mobileAppAlerts
} from 'in-events/components/SmartAlerts/constants';
//@ts-expect-error TS migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { getCountLabel, getAllConfigStats } from 'in-events/components/SmartAlerts/utils';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { TabList } from 'in-events/components/SmartAlerts/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import { Location } from 'in-stores/navigation/types';

import locals from './SmartAlerts.mless';

const refreshSignalForStats = create().emit({ emitLatestOnSubscribe: false });

export function refreshSmartAlertConfigsStats(value: boolean) {
  refreshSignalForStats.emit(value);
}

const InfraSmartAlertsPresenter = createAsyncViewComponent(InfraSmartAlerts);
const SyntheticSmartAlertsPresenter = createAsyncViewComponent(SyntheticSmartAlerts);
const LogsSmartAlertsPresenter = createAsyncViewComponent(LogsSmartAlerts);
const ApplicationSmartAlertsPresenter = createAsyncViewComponent(ApplicationSmartAlerts);
const GlobalApplicationSmartAlertsPresenter = createAsyncViewComponent(GlobalApplicationSmartAlerts);
const WebsiteSmartAlertsPresenter = createAsyncViewComponent(WebsiteSmartAlerts);
const MobileAppSmartAlertsPresenter = createAsyncViewComponent(MobileAppSmartAlerts);

export default function SmartAlerts() {
  const [allConfigStats, setAllConfigStats] = useState(() => getAllConfigStats());
  useEffect(() => {
    refreshSignalForStats.subscribe(() => {
      setAllConfigStats(() => getAllConfigStats());
    });
  }, []);

  const { location, navigate } = useNavigation();
  const whichTab = getMatrixParameter(location, eventsPath, 'alertTab');
  const tabIndex = TabList.findIndex(item => item.id === whichTab);
  const tabIndexValue = tabIndex !== -1 ? tabIndex : 0;

  const [state, setState] = useState(tabIndexValue);

  const allConfigStatsData = useObservable(allConfigStats(), [])?.reduce((acc, stats) => {
    return { ...acc, ...stats?.data };
  }, {});

  useEffect(() => {
    setLocation(location, navigate, whichTab ?? 'globalSmartAlerts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LeftRightPadding>
      <CarbonTabs defaultSelectedIndex={state}>
        <CarbonTabList aria-label="Smart alert" contained>
          {TabList.map((list, index) => (
            <CarbonTab
              onClick={() => {
                setLocation(location, navigate, list.id);
                setState(index);
              }}
              key={index}
              secondaryLabel={getCountLabel(list.id, allConfigStatsData)}
            >
              {list.label}
            </CarbonTab>
          ))}
        </CarbonTabList>
        <CarbonTabPanels>
          <div className={locals.bottomMargin}>{getAlertList(TabList[state].id)}</div>
        </CarbonTabPanels>
      </CarbonTabs>
    </LeftRightPadding>
  );
}

function getAlertList(type: string) {
  if (type === infraAlerts) {
    return <InfraSmartAlertsPresenter isEventsView />;
  } else if (type === syntheticAlerts) {
    return <SyntheticSmartAlertsPresenter isEventsView />;
  } else if (type === logAlerts) {
    return <LogsSmartAlertsPresenter isEventsView isLogsDashboardHeader />;
  } else if (type === globalSmartAlerts) {
    return <GlobalApplicationSmartAlertsPresenter />;
  } else if (type === smartAlerts) {
    return <ApplicationSmartAlertsPresenter />;
  } else if (type === websiteAlerts) {
    return <WebsiteSmartAlertsPresenter isEventsView />;
  } else if (type === mobileAppAlerts) {
    return <MobileAppSmartAlertsPresenter isEventsView />;
  }

  return null;
}

function setLocation(
  location: Location,
  navigate: (target: Location, replace?: boolean | undefined) => void,
  tabId: string
) {
  setOrDeleteMatrixKey(location, eventsPath, 'eventId', null);
  setOrDeleteMatrixKey(location, eventsPath, 'alertTab', tabId);
  setOrDeleteMatrixKey(location, eventsPath, 'alertOrderBy', null);
  setOrDeleteMatrixKey(location, eventsPath, 'alertOrderDirection', null);
  setOrDeleteMatrixKey(location, eventsPath, 'page', null);
  setOrDeleteMatrixKey(location, eventsPath, 'query', null);
  setOrDeleteMatrixKey(location, eventsPath, 'pageSize', null);
  navigate(location);
}
