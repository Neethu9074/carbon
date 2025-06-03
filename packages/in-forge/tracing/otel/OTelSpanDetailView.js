/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ExpandableGroup } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { useLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

import locals from './OTelSpanDetailsView.mless';

export default function OTelSpanDetailView({ span }) {
  const error = span.getIn(['data', 'error']);
  const errorDetail = span.getIn(['data', 'error_detail']);
  const traceState = span.getIn(['data', 'trace_state']);
  const events = span.getIn(['data', 'events'], []);
  const links = span.getIn(['data', 'links'], []);

  const toKeyValueMap = map => Object.entries(map).map(([name, value]) => ({ name, value }));
  const tags = toKeyValueMap(span.getIn(['data', 'tags'], emptyMap).toJS());
  const resource = toKeyValueMap(span.getIn(['data', 'resource'], emptyMap).toJS());

  const getLinkToTraceDetail = useLinkToTraceDetail();
  const { trackTraceViewCallTreeDetailClicked } = useApplicationTracker();

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.otel.service')}>{span.getIn(['data', 'service'])}</Di>
        <Di title={t('in-forge:tracing.otel.operation')}>{span.getIn(['data', 'operation'])}</Di>
        {traceState != null && <Di title={t('in-forge:tracing.otel.traceState')}>{traceState}</Di>}
        {error != null && (
          <Di title={t('in-forge:tracing.otel.error')} rowClassName={locals.error}>
            {error}
            {errorDetail != null && ` – ${errorDetail}`}
          </Di>
        )}
      </Dl>
      <Card title={t('in-forge:tracing.otel.tags')} hasMarginBottom>
        <SidebarTagList tags={tags} />
      </Card>
      <Card title={t('in-forge:tracing.otel.resource')} hasMarginBottom>
        <SidebarTagList tags={resource} />
      </Card>

      <Dl>
        {events && events.size > 0 && (
          <ExpandableGroup title={t('in-forge:tracing.otel.events')}>
            {events.map((event, index) => (
              <div className={classNames({ [locals.eventGroup]: index < events.size - 1 })}>
                <ExpandableGroup
                  expandedTitle={t('in-forge:tracing.otel.eventDetails')}
                  title={t('in-forge:tracing.otel.eventNamePrefix') + event.get('name')}
                >
                  <Dl>
                    <Di title={t('in-forge:tracing.otel.eventName')}>{event.get('name')}</Di>
                    <Di title={t('in-forge:tracing.otel.timestamp')}>{formatDateTime(event.get('ts'))}</Di>
                  </Dl>
                  {event.get('tags') && (
                    <Card title={t('in-forge:tracing.otel.tags')} hasMarginBottom>
                      <SidebarTagList tags={toKeyValueMap(event.get('tags', emptyMap).toJS())} />
                    </Card>
                  )}
                </ExpandableGroup>
              </div>
            ))}
          </ExpandableGroup>
        )}
      </Dl>

      <Dl>
        {links && links.size > 0 && (
          <ExpandableGroup title={t('in-forge:tracing.otel.links')}>
            {links.map((link, index) => (
              <div className={classNames({ [locals.eventGroup]: index < links.size - 1 })}>
                <ExpandableGroup
                  expandedTitle={t('in-forge:tracing.otel.linkDetails')}
                  title={t('in-forge:tracing.otel.traceIdPrefix') + link.get('trace_id')}
                >
                  <Dl>
                    <Di title={t('in-forge:tracing.otel.traceId')}>
                      <Link
                        href={getLinkToTraceDetail(link.get('trace_id'))}
                        onClick={() => trackTraceViewCallTreeDetailClicked()}
                      >
                        {link.get('trace_id')}
                      </Link>
                    </Di>
                    <Di title={t('in-forge:tracing.otel.spanId')}>
                      <Link
                        href={getLinkToTraceDetail(link.get('trace_id'), { callId: link.get('span_id') })}
                        onClick={() => trackTraceViewCallTreeDetailClicked()}
                      >
                        {link.get('span_id')}
                      </Link>
                    </Di>
                  </Dl>
                  {link.get('tags') && (
                    <Card title={t('in-forge:tracing.otel.tags')} hasMarginBottom>
                      <SidebarTagList tags={toKeyValueMap(link.get('tags', emptyMap).toJS())} />
                    </Card>
                  )}
                </ExpandableGroup>
              </div>
            ))}
          </ExpandableGroup>
        )}
      </Dl>
    </div>
  );
}
