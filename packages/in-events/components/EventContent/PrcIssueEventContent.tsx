/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

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

// import { LineChart } from '@instana/carbon-charts';
// import { LineChartOptions, ScaleTypes } from '@carbon/charts-react';

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
      {/* experiemntal work below to try to include a line chart of the probability of failure over time */}
      {/* <Row withoutSideMargin>
      <Col xs>
          <Card title={"Fault Probability"}>
            <PrcConfidenceChart event={event} />
          </Card>
        </Col>
      </Row> */}
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

// interface PrcConfidenceChartProps {
//   event: EventOrMap
// }

// const chartOptions : LineChartOptions = {
// 	axes: {
// 		bottom: {
// 			title: "Date",
// 			mapsTo: "end",
//       scaleType: ScaleTypes.TIME,
// 		},
// 		left: {
// 			mapsTo: "prcProbability",
// 			title: "Probability",
//       scaleType: ScaleTypes.LINEAR
// 		}
// 	},
//   legend:{
//     enabled:false
//   },
//   experimental:true,
// }

// type confidenceData = {
//   prcProbability: number,
//   start: string,
//   end: string
// }

// function PrcConfidenceChart({ event } : PrcConfidenceChartProps) {
//   const prcEvaluationWindows : any[] = event.getIn(['metadata', 'prcEvaluationWindows'], []);
//   console.log(prcEvaluationWindows)
//   const data : confidenceData[]  = prcEvaluationWindows.map(x => {
//     return {
//       prcProbability: x.get('prcProbability'),
//       start: `${formatDate(x.get('start'))} ${formatTime(x.get('start'))}`,
//       end: `${formatDate(x.get('end'))}T${formatTime(x.get('end'))}`
//     }
//   }
//   )
//   console.log(data)

//   const mockData = [
//     {group: "Probability of Failure",
//       prcProbability: 0.7,
//      end: "2019-01-02T05:00:00.000Z"
//     },
//     {group: "Probability of Failure",
//       prcProbability: 0.8,
//       end: "2019-01-02T05:10:00.000Z"
//      },
//   ]

//   return (
//     <LineChart data={mockData} options={chartOptions}/>
//   )
// }
