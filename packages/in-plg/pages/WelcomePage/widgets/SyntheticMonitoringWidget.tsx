/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { LocationListItem, TestResultListItem, VersionedConfig } from '@instana/types';
import { Link, Typography } from '@instana/components';
import { formatDateTime } from '@instana/format-date';
import { LocationStatus } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  alertsTabDetailsFullyQualified,
  syntheticSmartAlertsPath,
  syntheticsSummaryPath,
  syntheticsDashboard,
  syntheticsPath,
  syntheticLocationPath
} from 'in-synthetics/navigation/paths';
import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
//@ts-expect-error doesn't contain type file
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { SyntheticProps, SyntheticInfraColumn } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { getResolvedTimeConfig } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import CreateSyntheticTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialog';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { massageLocationDisplayLabel } from 'in-synthetics/utils/massageLocationDisplayLabel';
import { meanLatencyFixed, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getLocationData } from 'in-synthetics/dashboards/global/LocationList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { clickSyntheticMonitoringTestTracker } from 'in-synthetics/tracker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getSyntheticType } from 'in-synthetics/utils/syntheticTypeMap';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import HealthIcon from 'in-plg/components/HealthIcon/HealthIcon';
import { getChartGranularity } from 'in-stores/metric/metric';
import { playwithEnabled } from 'in-services/featureFlags';
import { hasSyntheticsAccess } from 'in-stores/permission';
import { Location } from 'in-stores/navigation/types';
import { timeConfig$ } from 'in-stores/time/config';
import { role } from 'in-stores/user';

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function SyntheticMonitoringWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: SyntheticProps) {
  const { location, createHref, createHrefToPath } = useNavigation();
  const [syntheticType, setSyntheticType] = useState(0);

  const syntheticArray = [
    { value: 'test', label: 'Tests' },
    { value: 'location', label: 'Locations' },
    { value: 'smartalerts', label: 'Smart alerts' }
  ];

  const syntheticToogleArray: string[] = syntheticArray.map(ele => ele.label);

  function setToogle(index: number) {
    setSyntheticType(index);
  }

  const syntheticTypeValue = syntheticArray[syntheticType]?.value;

  function getAddLabel() {
    if (syntheticTypeValue === 'test') {
      return t('in-plg:welcomepage.component.syntheticWidget.testLabel');
    }
    if (syntheticTypeValue === 'location') {
      return t('in-plg:welcomepage.component.syntheticWidget.locationLabel');
    }
    return t('in-plg:welcomepage.component.syntheticWidget.smartAlertLabel');
  }

  function getSearchAndViewAllLabel() {
    if (syntheticTypeValue === 'test') {
      return t('in-plg:welcomepage.component.syntheticWidget.searchAndViewAllTestLabel');
    }
    if (syntheticTypeValue === 'location') {
      return t('in-plg:welcomepage.component.syntheticWidget.searchAndViewAllLocationLabel');
    }
    return t('in-plg:welcomepage.component.syntheticWidget.searchAndViewAllSmartAlertLabel');
  }

  dashboardTileProps = {
    ...dashboardTileProps,
    addLabel: getAddLabel(),
    searchAndViewAllLabel: getSearchAndViewAllLabel(),
    toggles: syntheticToogleArray,
    toggleCallback: index => setToogle(index)
  };

  function getData(params: any) {
    if (syntheticTypeValue === 'test') {
      return getTestSummaryListData(params);
    } else if (syntheticTypeValue === 'location') {
      return getLocationData(params);
    }
    return getAllAlertConfigs('', { asObservable: true });
  }

  const getHeaders = () => {
    if (syntheticTypeValue === 'test') {
      return [
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.type'),
          key: 'type'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.successRate'),
          key: 'successRate'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.latency'),
          key: 'latency'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.health'),
          key: 'health'
        }
      ];
    }
    if (syntheticTypeValue === 'location') {
      return [
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.type'),
          key: 'type'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.lastTestRunOn'),
          key: 'lastTestRunOn'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.version'),
          key: 'version'
        },
        {
          header: t('in-plg:welcomepage.component.syntheticWidget.health'),
          key: 'health'
        }
      ];
    }
    return [
      {
        header: t('in-plg:welcomepage.component.syntheticWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.syntheticWidget.timeThreshold'),
        key: 'timeThreshold'
      },
      {
        header: t('in-plg:welcomepage.component.syntheticWidget.testsApplied'),
        key: 'testsApplied'
      },
      {
        header: t('in-plg:welcomepage.component.syntheticWidget.health'),
        key: 'health'
      }
    ];
  };

  const getLinks = () => {
    if (syntheticTypeValue === 'test') {
      return createHrefToPath(syntheticsPath);
    }
    if (syntheticTypeValue === 'location') {
      return createHrefToPath(syntheticLocationPath);
    }
    return createHrefToPath(syntheticSmartAlertsPath);
  };

  function createLinkLocation(item: VersionedConfig | TestResultListItem, location: Location) {
    if (syntheticTypeValue === 'test') {
      return CreateTestLinkLocation(item as TestResultListItem);
    } else {
      return createSmartAlertLinkLocation(item as VersionedConfig, location);
    }
  }

  function CreateTestLinkLocation(item: TestResultListItem) {
    location.pathname = syntheticsSummaryPath;
    const locations = item?.testResultCommonProperties?.testCommonProperties?.locationStatusList;
    let locationDisplayLabels: string = '';
    let locationIds: string = '';
    if (locations != undefined && locations != null && locations.length > 0) {
      locations.forEach((aLocation: LocationStatus) => {
        let tempLabel = aLocation.locationDisplayLabel ?? '';
        tempLabel = massageLocationDisplayLabel(tempLabel, aLocation.locationId);
        locationDisplayLabels =
          locationDisplayLabels.length === 0 ? tempLabel : locationDisplayLabels + ',' + tempLabel;
        locationIds = locationIds.length === 0 ? aLocation.locationId : locationIds + ',' + aLocation.locationId;
      });
    }
    setOrDeleteMatrixKey(
      location,
      syntheticsDashboard,
      'testId',
      item?.testResultCommonProperties?.testCommonProperties?.id
    );
    setOrDeleteMatrixKey(
      location,
      syntheticsDashboard,
      'testLabel',
      item?.testResultCommonProperties?.testCommonProperties?.label
    );
    setOrDeleteMatrixKey(
      location,
      syntheticsDashboard,
      'type',
      getSyntheticType(item?.testResultCommonProperties?.testCommonProperties?.type ?? '')
    );
    setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationDisplayLabels', locationDisplayLabels);
    setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationIds', locationIds);

    return createHref(location);
  }

  function createSmartAlertLinkLocation(item: VersionedConfig, location: Location) {
    const rowLinkLocation = {
      ...location,
      pathname: alertsTabDetailsFullyQualified
    };

    setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertIdMatrixParam, item.id);
    setOrDeleteMatrixKey(rowLinkLocation, syntheticSmartAlertsPath, alertCreatedMatrixParam, item.initialCreated);
    return createHref(rowLinkLocation);
  }

  const columnDefinitions: SyntheticInfraColumn = {
    test: [
      {
        key: 'name',
        getContent({ item }) {
          return (
            <Link
              href={createLinkLocation(item, location)}
              onClick={() => clickSyntheticMonitoringTestTracker({ detail: 'View Synthetic test dashboard' })}
            >
              {item?.testResultCommonProperties?.testCommonProperties?.label}
            </Link>
          );
        }
      },
      {
        key: 'type',
        getContent({ item }) {
          return (
            <Typography variant="body-regular">{item.testResultCommonProperties.testCommonProperties.type}</Typography>
          );
        }
      },
      {
        key: 'successRate',
        getContent({ item }) {
          const totalRuns = get(item, ['metrics', 'total_test_runs', 0, 1], 0);
          const successRuns = get(item, ['metrics', 'successful_test_runs', 0, 1], 0);
          if (totalRuns != 0) {
            return (
              <Typography variant="body-regular">{percentageTwoDecimalPlaces(successRuns / totalRuns)}</Typography>
            );
          } else {
            return (
              <Typography variant="body-regular">{t('in-plg:welcomepage.component.syntheticWidget.na')}</Typography>
            );
          }
        }
      },
      {
        key: 'latency',
        getContent({ item, result }) {
          return (
            <SparkChart
              loading={result?.progress?.loading}
              rollup={getChartGranularity(timeConfig)}
              timeConfig={getResolvedTimeConfig(timeConfig, result?.time)}
              aggregation="MEAN"
              metrics={item?.metrics.avg_response_time}
              metric={item?.metrics.response_time}
              tooltipFormatter={meanLatencyFixed.compact}
            />
          );
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          const totalRuns = get(item, ['metrics', 'total_test_runs', 0, 1], 0);
          const successRuns = get(item, ['metrics', 'successful_test_runs', 0, 1], 0);
          let severity = totalRuns - successRuns;
          if (totalRuns != 0 && successRuns / totalRuns == 1) {
            severity = 0;
          } else if (totalRuns - successRuns > 10) {
            severity = 10;
          }
          return <HealthIcon severity={severity} iconSize="xs" />;
        }
      }
    ],
    location: [
      {
        key: 'name',
        getContent({ item }) {
          return <LocationNameLink item={item} />;
        }
      },
      {
        key: 'type',
        getContent({ item }) {
          return <Typography variant="body-regular">{item?.type}</Typography>;
        }
      },
      {
        key: 'lastTestRunOn',
        getContent({ item }) {
          return <Typography variant="body-regular">{formatDateTime(item.lastRunOn)}</Typography>;
        }
      },
      {
        key: 'version',
        getContent({ item }) {
          return <Typography variant="body-regular">{item?.popVersion}</Typography>;
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          const openIssues = item.entityHealthInfo?.openIssues?.length ?? -1;
          let maxSev = item.entityHealthInfo?.maxSeverity ?? -1;
          if (openIssues === 0) {
            maxSev = 0;
          }
          if (item.entityHealthInfo?.maxSeverity > 10) {
            maxSev = 10;
          } else if (item.entityHealthInfo?.maxSeverity === undefined) {
            return (
              <Typography variant="body-regular">{t('in-plg:welcomepage.component.syntheticWidget.na')}</Typography>
            );
          }
          return <HealthIcon severity={maxSev} iconSize="xs" />;
        }
      }
    ],
    smartalerts: [
      {
        key: 'name',
        getContent({ item }) {
          return <Link href={createLinkLocation(item, location)}>{item?.name}</Link>;
        }
      },
      {
        key: 'timeThreshold',
        getContent({ item }) {
          return <Typography variant="body-regular">{item?.timeThreshold.violationsCount}</Typography>;
        }
      },
      {
        key: 'testsApplied',
        getContent({ item }) {
          return <Typography variant="body-regular">{item?.syntheticTestIds.length}</Typography>;
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          return <HealthIcon severity={item.severity} iconSize="xs" />;
        }
      }
    ]
  };

  function LocationNameLink({ item }: { item: LocationListItem }) {
    const entityHealthInfo = item.entityHealthInfo;
    const href = useGetDashboardLink()(item.popSnapshotId ?? '', {
      pathname: physicalDashboardPath
    });
    return entityHealthInfo === undefined ? <Link>{item?.label}</Link> : <Link href={href}>{item?.label}</Link>;
  }

  function addMore() {
    let addDialog;
    const onClose = () => {
      close();
    };

    if (syntheticTypeValue === 'test') {
      addDialog = addActiveDialog(<CreateSyntheticTestDialog onClose={onClose} />);
    } else if (syntheticTypeValue === 'smartalerts') {
      addDialog = addActiveDialog(<CreateSmartAlertDialog />);
    }

    return addDialog;
  }

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions: columnDefinitions[syntheticTypeValue],
    syntheticType: syntheticTypeValue,
    headers: getHeaders()
  };

  return (
    <DatatableWrapper
      {...generalProps}
      getItems={getData}
      tableType="syntheticWidget"
      label={`${widgetLabel}.${syntheticTypeValue}`}
      dashboardTileProps={dashboardTileProps}
      hasAddPermission={role?.canConfigureSyntheticTests}
      hasAddMore={hasSyntheticsAccess && syntheticTypeValue !== 'location' && !playwithEnabled}
      viewAll
      href={getLinks()}
      addMore={addMore}
      addData={addMore}
    />
  );
});
