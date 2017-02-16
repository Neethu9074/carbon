/* eslint-disable react/no-multi-comp */
import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getAuditLog, getTotalAuditLogEntries} from 'in-services/auditLog';
import Section from 'in-views/configurationView/components/Section';
import DownloadButton from 'in-components/DownloadButton';
import {fromNow} from 'in-services/formatters/date';
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
          <AuditLogEntries offset={this.state.offset}
                           query={this.state.query}
                           onOffsetChanged={offset => this.setState({offset})}
                           onQueryChanged={query => this.setState({
                             query,
                             offset: 0
                           })} />
        </Section>
      </SubViewWrapper>
    );
  }
});

const AuditLogEntries = connectTo(props => {
  return {
    logs: getAuditLog(props.offset, props.query),
    totalEntries: getTotalAuditLogEntries(props.query)
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
    const onOffsetChanged = this.props.onOffsetChanged;
    const onQueryChanged = this.props.onQueryChanged;
    const totalEntries = this.props.totalEntries;
    const offset = this.props.offset;
    const logs = this.props.logs;

    if (!totalEntries || !logs) {
      return null;
    }

    const currentShownPage = (offset / NUM_ENTRIES_PER_PAGE) + 1;
    const totalPages = Math.ceil(totalEntries / NUM_ENTRIES_PER_PAGE);

    return (
      <ul className={`${block}__list`}>
        <div className={`${block}__heading`}>
          <h3>
            {`Recent events (${totalEntries})`}
          </h3>

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
            <DownloadButton className={`${block}__download-link`}>
              <AuditLogDownloadView />
            </DownloadButton>
          </div>
        </div>
        {logs.map(logEntry =>
          <li key={logEntry.get('id')}
              className={`${block}__item`}>
            <div className={`${block}__user-side`}>
              <Gravatar email={'stan@instana.com'}
                        className={`${block}__avatar`} />

              <div>
                <span className={`${block}__full-name`}>
                  stan
                </span>
                <span className={`${block}__topic`}>
                  {` - ${logEntry.get('action')}`}
                </span>
                <div>
                  {logEntry.get('message')}
                </div>
                <span className={`${block}__time`}>
                  {fromNow(logEntry.get('timestamp'))}
                </span>
              </div>
            </div>
          </li>
        )}
        <div className={`${block}__footer`}>
          <SvgIcon className={`${block}__icon`}
                   type='triangle_left'
                   width={8}
                   color='#172429'
                   onClick={() => {
                     if (currentShownPage > 1) {
                       onOffsetChanged(offset - NUM_ENTRIES_PER_PAGE);
                     }
                   }} />

          {`${currentShownPage} / ${totalPages}`}

          <SvgIcon className={`${block}__icon`}
                   type='triangle_right'
                   width={8}
                   color='#172429'
                   onClick={() => {
                     if (currentShownPage < totalPages) {
                       onOffsetChanged(offset + NUM_ENTRIES_PER_PAGE);
                     }
                   }} />
        </div>
      </ul>
    );
  }
}));
