/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import { LocationListItem, TestResultListItem, VersionedConfig } from '@instana/types';
import { CarbonTabPanel, Link, TableTab, TableTabs } from '@instana/components';
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
  SyntheticProps,
  SyntheticInfraColumn,
  ToggleType,
  GetTestSummaryList,
  GetLocationData
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import {
  alertId as alertIdMatrixParam,
  alertCreated as alertCreatedMatrixParam
} from 'in-synthetics/navigation/matrix';
//@ts-expect-error doesn't contain type file
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getResolvedTimeConfig } from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import CreateSyntheticTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialog';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { massageLocationDisplayLabel } from 'in-synthetics/utils/massageLocationDisplayLabel';
import { meanLatencyFixed, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import { clickSyntheticMonitoringTestTracker } from 'in-synthetics/tracking/tracker';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getLocationData } from 'in-synthetics/dashboards/global/LocationList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getSyntheticType } from 'in-synthetics/utils/syntheticTypeMap';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import { Location } from 'in-stores/navigation/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { role } from 'in-stores/user';

const syntheticArrayOptions = {
  test: 'test',
  location: 'location',
  smartalerts: 'smartalerts'
} as const;

function Toggles({
  toggles,
  selectedType,
  setSelectedType
}: {
  toggles: ToggleType[];
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <TableTabs
      selectedIndex={toggles.filter(toggle => toggle.value === selectedType).map(toggle => toggle.index)[0]}
      panels={toggles?.length > 0 && toggles.map(({ index }) => <CarbonTabPanel key={index} />)}
    >
      {toggles?.length > 0 &&
        toggles.map(toggle => (
          <TableTab
            key={toggle.index}
            isDisabled={false}
            label={toggle.label}
            icon={toggle.icon}
            onClick={() => setSelectedType(toggle.value)}
          />
        ))}
    </TableTabs>
  );
}

export default function SyntheticMonitoringWidget({
  config,
  timeConfig,
  widgetLabel,
  dashboardTileProps
}: SyntheticProps) {
  const { trackCta } = useSegmentTracking();
  const [selectedType, setSelectedType] = useState(localStorage.getItem('selectedSyntheticType') ?? 'test');
  const { location, createHref, createHrefToPath } = useNavigation();

  const toggles = [
    { value: syntheticArrayOptions.test, label: 'Tests', index: 0, icon: 'lib_synthetic' },
    { value: syntheticArrayOptions.location, label: 'Locations', index: 1, icon: 'lib_synthetic_location' },
    { value: syntheticArrayOptions.smartalerts, label: 'Smart Alerts', index: 2, icon: 'lib_alerts_alert' }
  ];

  useEffect(() => {
    localStorage.setItem('selectedSyntheticType', selectedType);
  }, [selectedType]);

  /**
   * The function generates label which can be used as a placeholder text.
   * @returns The label for the placeholder.
   */
  const getPlaceholderLabel = (): string | null => {
    if (selectedType === syntheticArrayOptions.test) {
      return t('in-plg:welcomepage.component.syntheticWidget.testSearchPlaceholderLabel');
    }
    if (selectedType === syntheticArrayOptions.smartalerts) {
      return t('in-plg:welcomepage.component.syntheticWidget.smartalertsSearchPlaceholderLabel');
    }
    return t('in-plg:welcomepage.component.syntheticWidget.locationsSearchPlaceholderLabel');
  };

  /**
   * The function generates label which can be used for the Add button.
   * @returns The label of the add button.
   */
  const getButtonLabel = (): string | null => {
    if (selectedType === syntheticArrayOptions.test) {
      return t('in-plg:welcomepage.component.syntheticWidget.testAddButtonLabel');
    }
    if (selectedType === syntheticArrayOptions.smartalerts) {
      return t('in-plg:welcomepage.component.syntheticWidget.smartalertsAddButtonLabel');
    }
    return null;
  };

  /**
   * The function generates label which can be used as a placeholder text.
   * @returns The label for the placeholder.
   */
  const getViewAllLabel = (): string | null => {
    if (selectedType === syntheticArrayOptions.test) {
      return t('in-plg:welcomepage.component.syntheticWidget.testViewAllLabel');
    }
    if (selectedType === syntheticArrayOptions.smartalerts) {
      return t('in-plg:welcomepage.component.syntheticWidget.smartalertsViewAllLabel');
    }
    return t('in-plg:welcomepage.component.syntheticWidget.locationsViewAllLabel');
  };

  dashboardTileProps = {
    ...dashboardTileProps,
    toggles: <Toggles toggles={toggles} selectedType={selectedType} setSelectedType={setSelectedType} />
  };

  function getData(params: GetTestSummaryList | GetLocationData) {
    if (selectedType === syntheticArrayOptions.test) {
      return getTestSummaryListData(params);
    } else if (selectedType === syntheticArrayOptions.location) {
      return getLocationData(params);
    }
    return getAllAlertConfigs('', { asObservable: true });
  }

  const getHeaders = () => {
    if (selectedType === syntheticArrayOptions.test) {
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
    if (selectedType === syntheticArrayOptions.location) {
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
    if (selectedType === syntheticArrayOptions.test) {
      return createHrefToPath(syntheticsPath);
    }
    if (selectedType === syntheticArrayOptions.location) {
      return createHrefToPath(syntheticLocationPath);
    }
    return createHrefToPath(syntheticSmartAlertsPath);
  };

  function createLinkLocation(item: VersionedConfig | TestResultListItem, location: Location) {
    if (selectedType === syntheticArrayOptions.test) {
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
            <Tooltip
              content={item?.testResultCommonProperties?.testCommonProperties?.label}
              align="auto"
              caret={false}
              delay={300}
            >
              <Link
                href={createLinkLocation(item, location)}
                onClick={() => clickSyntheticMonitoringTestTracker(trackCta)}
              >
                {item?.testResultCommonProperties?.testCommonProperties?.label}
              </Link>
            </Tooltip>
          );
        }
      },
      {
        key: 'type',
        getContent({ item }) {
          return <TypographyWithTooltip content={item.testResultCommonProperties.testCommonProperties.type} />;
        }
      },
      {
        key: 'successRate',
        getContent({ item }) {
          const totalRuns = get(item, ['metrics', 'total_test_runs', 0, 1], 0);
          const successRuns = get(item, ['metrics', 'successful_test_runs', 0, 1], 0);
          if (totalRuns != 0) {
            return <TypographyWithTooltip content={percentageTwoDecimalPlaces(successRuns / totalRuns)} />;
          } else {
            return <TypographyWithTooltip content={t('in-plg:welcomepage.component.syntheticWidget.na')} />;
          }
        }
      },
      {
        key: 'latency',
        getContent({ item, timeConfig, result }) {
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
          return (
            <Tooltip content={item?.label} align="auto" caret={false} delay={300}>
              <span>
                <LocationNameLink item={item} />
              </span>
            </Tooltip>
          );
        }
      },
      {
        key: 'type',
        getContent({ item }) {
          return <TypographyWithTooltip content={item?.type} />;
        }
      },
      {
        key: 'lastTestRunOn',
        getContent({ item }) {
          return <TypographyWithTooltip content={formatDateTime(item.lastRunOn) as string} />;
        }
      },
      {
        key: 'version',
        getContent({ item }) {
          return <TypographyWithTooltip content={item?.popVersion} />;
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
            return <TypographyWithTooltip content={t('in-plg:welcomepage.component.syntheticWidget.na')} />;
          }
          return <HealthIcon severity={maxSev} iconSize="xs" />;
        }
      }
    ],
    smartalerts: [
      {
        key: 'name',
        getContent({ item }) {
          return (
            <Tooltip content={item?.name} align="auto" caret={false} delay={300}>
              <Link href={createLinkLocation(item, location)}>{item?.name}</Link>
            </Tooltip>
          );
        }
      },
      {
        key: 'timeThreshold',
        getContent({ item }) {
          return <TypographyWithTooltip content={item?.timeThreshold.violationsCount} />;
        }
      },
      {
        key: 'testsApplied',
        getContent({ item }) {
          return <TypographyWithTooltip content={item?.syntheticTestIds.length} />;
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

    if (selectedType === 'test') {
      addDialog = addActiveDialog(<CreateSyntheticTestDialog onClose={onClose} />);
    } else if (selectedType === 'smartalerts') {
      addDialog = addActiveDialog(<CreateSmartAlertDialog />);
    }

    return addDialog;
  }

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions: columnDefinitions[selectedType],
    syntheticType: selectedType,
    headers: getHeaders()
  };

  /**
   * Checks whether the user has the permission to show the "Add tests +" or "Add smart alerts +" button.
   * @returns {boolean} Permission
   */
  const checkPermission = (): boolean => {
    if (selectedType === 'test') {
      return !!role?.canConfigureSyntheticTests;
    }
    if (selectedType === 'smartalerts') {
      return !!role?.canConfigureGlobalSyntheticSmartAlerts;
    }
    return false;
  };

  return (
    <DatatableWrapper
      {...generalProps}
      getItems={getData}
      tableType="syntheticWidget"
      label={`${widgetLabel}.${selectedType}`}
      dashboardTileProps={dashboardTileProps}
      hasAddPermission={checkPermission()}
      hasAddMore={checkPermission()}
      viewAll
      href={getLinks()}
      addMore={addMore}
      addData={addMore}
      searchPlaceholderLabel={getPlaceholderLabel()}
      addButtonLabel={getButtonLabel()}
      viewAllLabel={getViewAllLabel()}
    />
  );
}
