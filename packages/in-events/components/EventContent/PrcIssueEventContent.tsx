/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LineChart } from '@carbon/charts-react';
import { ScaleTypes } from '@carbon/charts';
import React from 'react';

import {
  Card,
  CarbonLayer,
  CarbonTable,
  CarbonTableHeader,
  CarbonTableRow,
  CarbonTableHead,
  CarbonTableBody,
  CarbonTableCell,
  Link
} from '@instana/components';
import { formatDate, formatTime } from '@instana/format-date';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// @ts-expect-error no typedef available
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
// @ts-expect-error no typedef available
import { getEventViewWithTimeFocusedAt } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error no typedef available
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
// @ts-expect-error no typedef available
import { getEvent, getEventSeverityLabelWithEventType } from 'in-stores/events';
// @ts-expect-error no typedef available
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { OnEntity } from 'in-events/components/EventsListRow';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import EventIcon from 'in-events/components/EventIcon';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { EventOrMap } from 'in-events/types';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

type TYPE_AFFECTED_INCIDENTS = EventOrMap[] | unknown[] | null | undefined;
type HEADER = {
  key: string;
  header: string;
  width?: string;
};

interface PrcIssueEventContentProps {
  event: EventOrMap;
}

export default function PrcIssueEventContent({ event }: PrcIssueEventContentProps) {
  const prcAttachedIncidents = event.getIn(['metadata', 'prcAttachedIncidents'], []);

  const timeConfig: TimeConfig = getTimeConfigFromEvent(event);
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  const relatedIncidentsHeaders: HEADER[] = [
    {
      key: 'type',
      header: ''
    },
    {
      key: 'name',
      header: t('in-events:headerTitle'),
      width: '25%'
    },
    {
      key: 'on',
      header: t('in-events:headerOn'),
      width: '25%'
    },
    {
      key: 'start',
      header: t('in-events:headerStarted'),
      width: '15%'
    },
    {
      key: 'end',
      header: t('in-events:headerEnd'),
      width: '15%'
    },
    {
      key: 'duration',
      header: t('in-events:titleDuration'),
      width: '15%'
    }
  ];
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <EntityWithParentInformation
              entityId={event.get('entityId')}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfig}
              linkTimeConfig={timeConfig}
              plugin={event.get('plugin')}
            />
            <ProblemDescription fixSuggestion={fixSuggestion} />
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleAffectedIncidents')}>
            <AffectedIncidentsTable
              prcAttachedIncidents={prcAttachedIncidents}
              headers={relatedIncidentsHeaders}
              timeConfig={timeConfig}
            />
          </Card>
        </Col>
      </Row>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleFaultProbabilityChart')}>
            <PrcConfidenceChart event={event} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

interface AffectedIncidentsTableProps {
  prcAttachedIncidents: any;
  headers: HEADER[];
  timeConfig: TimeConfig;
}

function AffectedIncidentsTable({ prcAttachedIncidents, headers, timeConfig }: AffectedIncidentsTableProps) {
  const { createHref, location } = useNavigation();
  const incidents: TYPE_AFFECTED_INCIDENTS =
    useObservable(combineLatest(prcAttachedIncidents.map(getEvent)).throttle(250), []) ?? [];

  if (!incidents) {
    return <LoadingIndicator size="xxxl" />;
  }

  if (incidents.length === 0) {
    return <AffectedIncidentsEmptyState />;
  }

  const incidentsInJs: any[] = incidents.map(incident => {
    const inc = incident as EventOrMap;
    const start = inc.get('start') as number;
    return {
      id: inc.get('id'),
      type: <EventIcon event={incident} tooltipLabel={getEventSeverityLabelWithEventType(inc, timeConfig)} size="xs" />,
      name: (
        <Tooltip content={t('in-events:affectedIncidents.affectedIncident')}>
          <Link
            href={createHref(
              getEventViewWithTimeFocusedAt(
                inc.get('start'),
                timeConfig.windowSize,
                location,
                inc.get('id'),
                inc.get('type')
              )
            )}
          >
            {inc.getIn(['problem', 'problemText'])}
          </Link>
        </Tooltip>
      ),
      end: <EndedMarker event={inc} justText />,
      start: (
        <Tooltip content={t('in-events:incident.setTimeConfig')}>
          <Link
            href={createHref(
              getEventViewWithTimeFocusedAt(
                inc.get('start'),
                timeConfig.windowSize,
                location,
                inc.get('id'),
                inc.get('type')
              )
            )}
          >
            {`${formatDate(start)} ${formatTime(start)}`}
          </Link>
        </Tooltip>
      ),
      duration: <EventDurationMarker event={inc} justText />,
      on: <OnEntity rawEvent={inc.toJS()} />
    };
  });

  return (
    <CarbonTable>
      <CarbonTableHead>
        <CarbonTableRow>
          {headers.map(header => (
            <CarbonTableHeader id={header.header} key={header.key}>
              {header.header}
            </CarbonTableHeader>
          ))}
        </CarbonTableRow>
      </CarbonTableHead>
      <CarbonTableBody>
        {incidentsInJs.map(incident => (
          <CarbonTableRow key={incident.id}>
            {headers.map(header => (
              <CarbonTableCell key={header.key}>{incident[header.key]}</CarbonTableCell>
            ))}
          </CarbonTableRow>
        ))}
      </CarbonTableBody>
    </CarbonTable>
  );
}

function AffectedIncidentsEmptyState() {
  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        <NoDataAvailable text={t('in-events:affectedIncidents.noAffectedIncidents')} />
      </CarbonLayer>
    </div>
  );
}

// experimental work to add a line chart for probability over time

interface PrcConfidenceChartProps {
  event: EventOrMap;
}

const chartOptions = {
  axes: {
    bottom: {
      title: '',
      mapsTo: 'end',
      scaleType: ScaleTypes.TIME,
      ticks: {
        formatter: (tick: number | Date) => {
          const date = tick instanceof Date ? tick : new Date(tick);
          // Set milliseconds to 0 to ignore them
          date.setMilliseconds(0);
          const formattedDate = formatDate(date.getTime());
          const formattedTime = formatTime(date.getTime());
          // Ensure we always return a string
          return formattedTime ? formattedDate + '\n' + formattedTime.toString() : '';
        }
      }
    },
    left: {
      mapsTo: 'prcProbability',
      title: t('in-events:labelFailureProbability'),
      scaleType: ScaleTypes.LINEAR
    }
  },
  legend: {
    enabled: false
  },
  height: '300px',
  grid: {
    x: {
      enabled: true
    },
    y: {
      enabled: true
    }
  },
  tooltip: {
    enabled: true,
    customHTML: (data: any[]) => {
      const dataPoint = data[0];
      if (!dataPoint) return '';

      // Get timestamp and remove milliseconds
      const date = new Date(dataPoint.end);
      date.setMilliseconds(0);
      const timestamp = date.getTime();

      return `
        <div class="carbon-tooltip-content">
          <p>${t('in-events:date')}: ${formatDate(timestamp)}</p>
          <p>${t('in-events:time')}: ${formatTime(timestamp)}</p>
          <p>${t('in-events:probability')}: ${dataPoint.prcProbability.toFixed(2)}</p>
        </div>
      `;
    }
  },
  curve: 'curveMonotoneX'
};

type ConfidenceData = {
  group: string;
  prcProbability: number;
  start: number;
  end: number;
};
function PrcConfidenceChart({ event }: PrcConfidenceChartProps) {
  let chartData: ConfidenceData[] = [];
  const prcEvaluationWindows: any[] = event.getIn(['metadata', 'prcEvaluationWindows'], []);
  prcEvaluationWindows.map((window: any) => {
    // Remove milliseconds from timestamps
    const start = parseInt(window.get('start'));
    const end = parseInt(window.get('end'));

    // Round timestamps to the nearest second by setting milliseconds to 0
    const startNoMs = new Date(start).setMilliseconds(0);
    const endNoMs = new Date(end).setMilliseconds(0);

    chartData.push({
      group: t('in-events:probability'),
      prcProbability: parseFloat(window.get('prcProbability')),
      start: startNoMs,
      end: endNoMs
    });
  });

  return <LineChart data={chartData} options={chartOptions} />;
}
