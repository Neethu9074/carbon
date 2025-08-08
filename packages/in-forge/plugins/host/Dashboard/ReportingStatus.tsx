/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ScaleTypes, StackedBarChart, TruncationTypes } from '@carbon/charts-react';
import { format, formatDistance } from 'date-fns';
import { Map } from 'immutable';
import React from 'react';

import { Stack, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

//@ts-expect-error
import { getMetricsAndMetadataForTimeframe } from 'in-stores/metric';
import { formatDateTime, formatDuration } from 'in-services/formatters/date';
import { timeConfigShiftedForIngestion } from 'in-stores/time/config';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from './ReportingStatus.mless';

interface ReportingStatusProps {
  snapshot: Map<string, string>;
  timeConfig: TimeConfig;
}

interface AvailabilityVersionsWithValue {
  from: number;
  to: number;
  availability: number; // number from 0 to 100
}

interface ChartData {
  status: string;
  keyLeft: string;
  keyRight: string;
  value: number;
  start: number;
  id: number;
  end: number;
  upTime: number;
}

interface MetricResponse {
  data: number[][];
  pollRate: number;
}

// if we set this to 100 then it becomes too sensitive and almost all green areas report as orange
const acceptableUptimeThreshold = 98;
// Modifier that determines how long before a rollup gap counts as an unavailable gap via ver.from > lastVer.to + (defaultRollup * rollupGapTolerance).
// Ex: if granularity is 5000 ms and modifier = 1 then if there is a gap > 10000 ms in the data then it will count as an unavailability
const rollupGapTolerance = 1;

export default function ReportingStatus({ snapshot, timeConfig }: ReportingStatusProps) {
  const defaultRollup = getInfraGranularity(timeConfig);
  const timeConfigShifted = timeConfigShiftedForIngestion(timeConfig);

  const messageCountSumMetric = useObservable<MetricResponse, [Map<string, string>]>(
    getMetricsAndMetadataForTimeframe({
      snapshotId: snapshot.get('id'),
      metric: '__message_count',
      timeConfig: timeConfigShifted,
      rollup: defaultRollup,
      aggregation: 'SUM'
    }),
    [snapshot]
  );

  const timeWindowFrom = (timeConfigShifted.to || Date.now()) - timeConfigShifted.windowSize;
  const timeWindowTo = timeConfigShifted.to || Date.now();
  const timeWindowDuration = timeWindowTo - timeWindowFrom;
  const pollRate = messageCountSumMetric?.pollRate ?? 1;

  // If we do not have a 'to' field in the timewindow then we can fromat the left hand side to say how
  // far ago from now. Otherwise put a timestamp
  const keyTimeLabelLeft = timeConfig.to
    ? format(new Date(timeWindowFrom), 'MMM d HH:mm')
    : formatDistance(timeWindowFrom, timeWindowTo, {
        addSuffix: true
      }).replace(/^(about|over|almost)\s/, '');

  // Similarly say "Now" when no 'to' field is in time config on the right axis
  const keyTimeLabelRight = timeConfig.to
    ? format(new Date(timeWindowTo), 'HH:mm MMM d ')
    : t('in-forge:plugins.host.dashboard.now');

  const reportingStatus = messageCountSumMetric
    ? processMetricsIntoCategories(messageCountSumMetric, timeWindowFrom, timeWindowTo, defaultRollup, pollRate)
    : [];

  // Process the versions with status into chart data
  const generateChartData = (): ChartData[] => {
    return reportingStatus.map((timeVersion, i) => {
      // Clamp to time window
      const from = timeVersion.from;
      const to = timeVersion.to;

      // Get percentage duration
      const percentageValue = Math.min(((to - from) / timeWindowDuration) * 100, 100);
      const status =
        timeVersion.availability > 0
          ? timeVersion.availability < acceptableUptimeThreshold
            ? `issues-${i}`
            : `Online-${i}`
          : `Offline-${i}`;
      return {
        status: status, // This will be what we map as unique groups on the chart to create a stacked bar effect
        keyLeft: keyTimeLabelLeft,
        keyRight: keyTimeLabelRight,
        upTime: timeVersion.availability, // How much this entity was reporting in a given time frame
        value: percentageValue, // How much percentage of the timewindow the snapshot was valid for
        start: timeVersion.from,
        id: i,
        end: timeVersion.to || (timeConfigShifted.to as number) // in case we have a null 'to' parameter
      };
    });
  };

  const chartData: ChartData[] = generateChartData();
  const label = snapshot ? snapshot.get('label', 'host') : 'host';

  return (
    <div className={locals.reportingStatusWrapper}>
      <Stack>
        <StackedBarChart
          options={{
            title: t('in-forge:plugins.host.dashboard.reportingStatus'),
            data: {
              groupMapsTo: 'status', // need to create groups based on unique status strings (i.e. online-1, offline-1, online-2) to create separate groups
              loading: chartData.length === 0
            },
            getFillColor(group: string) {
              // Here is where we set the value of the groups to be the same depending if they are "online" or "offline". So all Online-{i} groups will be green and all Offline-{i} groups will be red and all issues-{i} will be orange
              if (group.includes('Online')) {
                return themes.default.ids.color.option.green['800'];
              } else if (group.includes('issues')) {
                return themes.default.ids.color.option.orange['500'];
              }

              return themes.default.ids.color.option.red['500'];
            },
            axes: {
              // This is the "from" timestamp
              left: {
                scaleType: 'labels' as ScaleTypes,
                mapsTo: 'keyLeft',
                truncation: {
                  type: TruncationTypes.NONE
                }
              },
              // This is a percentage value so each unqiue grap can represent the percentage of time it was online/offline for in a timewindow
              bottom: {
                mapsTo: 'value',
                scaleType: 'linear' as ScaleTypes,
                stacked: true,
                percentage: true,
                ticks: {
                  formatter: (tick: number | Date) => (tick === 0 || tick === 100 ? '' : '|')
                }
              },
              // This is the "to" timestamp
              right: {
                mapsTo: 'keyRight',
                scaleType: 'labels' as ScaleTypes,
                truncation: {
                  type: TruncationTypes.NONE
                }
              }
            },
            fileDownload: {
              // substringing because filename limits is 256 on most OS': 256 - "-reporting-status" (17) - ".jpg"/".csv"/".png" (3)
              fileName: `${label.substring(0, 234)}-reporting-status`
            },
            // sleek, grid-less design
            grid: {
              x: {
                numberOfTicks: 1
              },
              y: {
                numberOfTicks: 0
              }
            },
            // No default legend, otherwise it would list "online-1", "online-2", "offline-1" etc..
            legend: {
              enabled: false
            },
            height: '9.375rem',
            width: '100%',
            tabularRepModal: {
              // Table headers
              tableHeadingFormatter: () => {
                return [
                  t('in-forge:plugins.infoTitle.status'),
                  t('in-forge:plugins.host.dashboard.duration'),
                  t('in-forge:plugins.host.dashboard.start'),
                  t('in-forge:plugins.host.dashboard.end')
                ];
              },
              // Table cells mapped to headers
              tableCellFormatter() {
                const rows: any[][] = []; // have to put any unfortunately

                chartData.forEach(version => {
                  const end = version.end;
                  const start = version.start;
                  const status = version.status;
                  let statusText;
                  if (status.includes('Online')) {
                    statusText = t('in-forge:plugins.host.dashboard.reporting');
                  } else if (status.includes('issues')) {
                    statusText = t('in-forge:plugins.host.dashboard.reportingWithIssues');
                  } else {
                    statusText = t('in-forge:plugins.host.dashboard.notReporting');
                  }
                  rows.push([statusText, formatDuration(end - start), formatDateTime(start), formatDateTime(end)]);
                });

                return rows;
              }
            },
            // This is customizing the tooltip when hovering over a segment in the chart
            tooltip: {
              customHTML: (data: ChartData[]) => {
                const { start, end, upTime } = data[0];

                return `
                  <div class=${locals.dashboardReportingStatusTooltip}>
                    <div class=${locals.dashboardReportingStatusTooltipTitle}>${upTime}% ${t(
                  'in-forge:plugins.host.dashboard.monitoringSuccess'
                )}</div>
                    <div class=${locals.dashboardReportingStatusTooltipContent}>
                      <div>
                        <span class=${locals.dashboardReportingStatusTooltipContentBold}>${t(
                  'in-forge:plugins.host.dashboard.start'
                )}:</span> ${formatDateTime(start)}
                      </div>
                      <div>
                        <span class=${locals.dashboardReportingStatusTooltipContentBold}>
                          ${t('in-forge:plugins.host.dashboard.end')}:
                        </span> ${formatDateTime(end)}
                      </div>
                    </div>
                  </div>
                `;
              }
            }
          }}
          data={chartData}
        />
        <Stack direction="horizontal">
          <LegendItem
            backgroundColor={themes.default.ids.color.option.green['800']}
            title={t('in-forge:plugins.host.dashboard.reporting')}
          />
          <LegendItem
            backgroundColor={themes.default.ids.color.option.orange['500']}
            title={t('in-forge:plugins.host.dashboard.reportingWithIssues')}
          />
          <LegendItem
            backgroundColor={themes.default.ids.color.option.red['500']}
            title={t('in-forge:plugins.host.dashboard.notReporting')}
          />
        </Stack>
      </Stack>
    </div>
  );
}

function LegendItem({ backgroundColor, title }: { backgroundColor: string; title: string }) {
  return (
    <Stack direction="horizontal" gap="xsmall">
      <div className={locals.colourBox} style={{ backgroundColor }} />
      <Typography variant="helper-text-01">{title}</Typography>
    </Stack>
  );
}

// Perhaps we can do introduce this in the backend as an API instead of doing it in the front end
/**
 * This function processes metrics into groups of versions. Outputs up the time a metric was reporting and how much it reported in that time frame
 * When there are gaps in the metric then we insert an unavailability
 *
 * @param metrics SUM metrics for __message_count
 * @param timeWindowFrom Start of time window
 * @param timeWindowTo End of time window
 * @param defaultRollup Rollup amount - used to calculate expected value in time range
 * @param wiggleRoom Wiggle room for metrics - used to determine when metric is not reporting vs an expected wiggle room gap
 * @param pollRate poll rate for metric - used to calculate expected value in time range
 * @returns AvailabilityVersionsWithValue[] - see interface above
 */
export function processMetricsIntoCategories(
  metrics: MetricResponse | Nullish,
  timeWindowFrom: number,
  timeWindowTo: number,
  defaultRollup: number,
  pollRate: number
): AvailabilityVersionsWithValue[] {
  if (!metrics || metrics.data.length <= 1) return [];

  const data = metrics.data;

  let bucketVersions = data.map(
    item =>
      ({
        from: item[0],
        to: item[0] + defaultRollup,
        availability: Math.round(Math.min(item[1] / (defaultRollup / 1000 / pollRate), 1) * 100)
      } as AvailabilityVersionsWithValue)
  );
  if (bucketVersions.length === 0) {
    return [{ from: timeWindowFrom, to: timeWindowTo, availability: 0 }];
  } else {
    if (timeWindowFrom < bucketVersions[0].from) {
      bucketVersions = [{ from: timeWindowFrom, to: bucketVersions[0].from, availability: 0 }, ...bucketVersions];
    }
    if (timeWindowTo > bucketVersions[bucketVersions.length - 1].to) {
      bucketVersions = [
        ...bucketVersions,
        { from: bucketVersions[bucketVersions.length - 1].to, to: timeWindowTo, availability: 0 }
      ];
    } else if (timeWindowTo < bucketVersions[bucketVersions.length - 1].to) {
      //we have an incomplete bucket so pop it and then extend the last version
      bucketVersions.pop();
      bucketVersions[bucketVersions.length - 1] = { ...bucketVersions[bucketVersions.length - 1], to: timeWindowTo };
    }
  }

  const bucketAvailability: AvailabilityVersionsWithValue[] = [];
  let lastVer: AvailabilityVersionsWithValue | undefined;
  bucketVersions.forEach(ver => {
    if (!lastVer) {
      lastVer = ver;
    } else if (lastVer) {
      if (ver.from > lastVer.to) {
        if (ver.from > lastVer.to + defaultRollup * rollupGapTolerance) {
          bucketAvailability.push(lastVer);
          bucketAvailability.push({ from: lastVer.to, to: ver.from, availability: 0 });
          lastVer = ver;
        } else {
          lastVer = { ...lastVer, to: ver.to };
        }
      } else if (lastVer.availability === ver.availability) {
        lastVer = { ...lastVer, to: ver.to };
      } else {
        bucketAvailability.push(lastVer);
        lastVer = ver;
      }
    }
  });
  if (lastVer) {
    // last bucket to push
    bucketAvailability.push(lastVer);
  }

  return bucketAvailability;
}
