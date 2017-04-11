/* eslint-disable react/no-multi-comp */
import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import { query$, setQuery } from 'in-views/configurationView/subview/AuditLog/stores/queryStore';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { setTimeout, clearTimeout } from 'in-services/chronos';
import { toHtml } from 'in-services/formatters/markdown';
import { emptyList } from 'in-services/fixedImmutables';
import { getAuditLog } from 'in-services/auditLog';
import Gravatar from 'in-components/Gravatar';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/AuditLog/AuditLog.less';

const block = 'in-audit-log';
const NUM_ENTRIES_PER_PAGE = 10;

export default connectTo(
  {
    query: query$
  },
  React.createClass({
    displayName: 'AuditLogs',

    getInitialState() {
      return {
        offset: 0
      };
    },

    componentWillMount() {
      setQuery('');
    },

    render() {
      return (
        <SubViewWrapper>
          <SubViewHeader>
            Audit Log
          </SubViewHeader>

          <Section>
            <AuditLogDownloadView offset={this.state.offset} query={this.props.query} />
          </Section>

          <AuditLogEntries
            offset={this.state.offset}
            onOffsetChanged={offset => this.setState({ offset })}
            onQueryChanged={() =>
              this.setState({
                offset: 0
              })}
          />
        </SubViewWrapper>
      );
    }
  })
);

const AuditLogEntries = connectTo(
  props => {
    return {
      log: query$.debounce(200, { setTimeout, clearTimeout }).flatMap(query => getAuditLog(props.offset, query)),
      query: query$
    };
  },
  function AuditLogEntries({ log, query, offset, onOffsetChanged, onQueryChanged }) {
    if (!log) {
      return null;
    }

    const totalEntries = log.get('total', 0);
    const entries = log.get('entries', emptyList);
    const currentShownPage = offset / NUM_ENTRIES_PER_PAGE + 1;
    const totalPages = Math.max(1, Math.ceil(totalEntries / NUM_ENTRIES_PER_PAGE));

    return (
      <Section>
        <div className={`${block}__heading`}>
          <SectionHeading>
            {`Recent events (${totalEntries})`}
          </SectionHeading>

          <div className={`${block}__right`}>
            <input
              className={`${block}__search`}
              type="search"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                onQueryChanged();
              }}
            />
          </div>
        </div>
        <ul className={`${block}__list`}>
          {entries.map(logEntry => (
            <li className={`${block}__item`} key={logEntry.get('id')}>
              <div className={`${block}__user-side`}>
                {logEntry.getIn(['actor', 'type']) !== 'API_TOKEN'
                  ? <Gravatar className={`${block}__avatar`} email={logEntry.getIn(['actor', 'email'])} />
                  : <div className={`${block}__spacer`} />}

                <div className={`${block}__text`}>
                  <span className={`${block}__full-name`}>
                    {logEntry.getIn(['actor', 'name'])}
                  </span>
                  <span className={`${block}__topic`}>
                    {` - ${logEntry.get('action')}`}
                  </span>
                  <span className={`${block}__time`}>
                    {` - ${fromNow(logEntry.get('timestamp'))} (${formatDateTime(logEntry.get('timestamp'))})`}
                  </span>
                  <div dangerouslySetInnerHTML={{ __html: toHtml(logEntry.get('message')) }} />
                </div>
              </div>
            </li>
          ))}
          <div className={`${block}__footer`}>
            <SvgIcon
              className={`${block}__icon`}
              type="triangle_left"
              width={8}
              color="#6B8088"
              onClick={() => {
                if (currentShownPage > 1) {
                  onOffsetChanged(offset - NUM_ENTRIES_PER_PAGE);
                  scrollToTop();
                }
              }}
            />

            {`${currentShownPage} / ${totalPages}`}

            <SvgIcon
              className={`${block}__icon`}
              type="triangle_right"
              width={8}
              color="#6B8088"
              onClick={() => {
                if (currentShownPage < totalPages) {
                  onOffsetChanged(offset + NUM_ENTRIES_PER_PAGE);
                  scrollToTop();
                }
              }}
            />
          </div>
        </ul>
      </Section>
    );
  }
);

function scrollToTop() {
  const scrollElement = document.querySelector('.in-config-view-active-view');
  if (scrollElement) {
    scrollElement.scrollTop = 0;
  }
}
