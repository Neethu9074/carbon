/* eslint-disable react/no-multi-comp */
import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import {fromNow, formatDateTime} from 'in-services/formatters/date';
import {toHtml} from 'in-services/formatters/markdown';
import {emptyList} from 'in-services/fixedImmutables';
import {getAuditLog} from 'in-services/auditLog';
import Gravatar from 'in-components/Gravatar';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/AuditLog/AuditLog.less';


const block = 'in-audit-log';
const NUM_ENTRIES_PER_PAGE = 10;

export default React.createClass({
  displayName: 'AuditLogs',

  getInitialState() {
    return {
      offset: 0,
      query: ''
    };
  },

  render() {
    return (
      <SubViewWrapper>
        <SubViewHeader>
          Audit Log
        </SubViewHeader>

        <Section>
          <AuditLogDownloadView offset={this.state.offset}
                                query={this.state.query} />
        </Section>

        <AuditLogEntries offset={this.state.offset}
                         query={this.state.query}
                         onOffsetChanged={offset => this.setState({offset})}
                         onQueryChanged={query => this.setState({
                           query,
                           offset: 0
                         })} />
      </SubViewWrapper>
    );
  }
});

const AuditLogEntries = connectTo(props => {
  return {
    log: getAuditLog(props.offset, props.query)
  };
},
React.createClass({
  displayName: 'AuditLogEntries',

  getInitialState() {
    return {
      query: this.props.query
    };
  },

  render() {
    const log = this.props.log;
    if (!log) {
      return null;
    }

    const onOffsetChanged = this.props.onOffsetChanged;
    const onQueryChanged = this.props.onQueryChanged;
    const offset = this.props.offset;

    const totalEntries = log.get('total', 0);
    const entries = log.get('entries', emptyList);
    const currentShownPage = (offset / NUM_ENTRIES_PER_PAGE) + 1;
    const totalPages = Math.max(1, Math.ceil(totalEntries / NUM_ENTRIES_PER_PAGE));

    return (
      <Section>
        <div className={`${block}__heading`}>
          <SectionHeading>
            {`Recent events (${totalEntries})`}
          </SectionHeading>

          <div className={`${block}__right`}>
            <div className={`${block}__search-button`}>
              <SvgIcon type='search'
                       height={12}
                       color='#2D4048'
                       onClick={() => onQueryChanged(this.state.query)} />
            </div>
            <input className={`${block}__search`}
                   type='search'
                   value={this.state.query}
                   onChange={e => this.setState({query: e.target.value})} />
          </div>
        </div>
        <ul className={`${block}__list`}>
          {entries.map(logEntry =>
            <li className={`${block}__item`}
                key={logEntry.get('id')}>
              <div className={`${block}__user-side`}>
                {logEntry.getIn(['actor', 'type']) !== 'API_TOKEN' ?
                  <Gravatar className={`${block}__avatar`}
                            email={logEntry.getIn(['actor', 'email'])} />
                : <div className={`${block}__spacer`} />}

                <div>
                  <span className={`${block}__full-name`}>
                    {logEntry.getIn(['actor', 'name'])}
                  </span>
                  <span className={`${block}__topic`}>
                    {` - ${logEntry.get('action')}`}
                  </span>
                  <div>
                    <div dangerouslySetInnerHTML={{__html: toHtml(logEntry.get('message'))}} />
                  </div>
                  <span className={`${block}__time`}>
                    {`${fromNow(logEntry.get('timestamp'))} (${formatDateTime(logEntry.get('timestamp'))})`}
                  </span>
                </div>
              </div>
            </li>
          )}
          <div className={`${block}__footer`}>
            <SvgIcon className={`${block}__icon`}
                     type='triangle_left'
                     width={8}
                     color='#6B8088'
                     onClick={() => {
                       if (currentShownPage > 1) {
                         onOffsetChanged(offset - NUM_ENTRIES_PER_PAGE);
                       }
                     }} />

            {`${currentShownPage} / ${totalPages}`}

            <SvgIcon className={`${block}__icon`}
                     type='triangle_right'
                     width={8}
                     color='#6B8088'
                     onClick={() => {
                       if (currentShownPage < totalPages) {
                         onOffsetChanged(offset + NUM_ENTRIES_PER_PAGE);
                       }
                     }} />
          </div>
        </ul>
      </Section>
    );
  }
}));
