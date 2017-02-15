import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import DownloadButton from 'in-components/DownloadButton';
import {fromNow} from 'in-services/formatters/date';
import {getAuditLog} from 'in-services/auditLog';
import Gravatar from 'in-components/Gravatar';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/AuditLog/AuditLog.less';


const block = 'in-audit-log';

export default connectTo({
  logs: getAuditLog()
},
function AuditLogs({logs}) {

  return (
    <SubViewWrapper>
      <SubViewHeader>
        Audit Log
      </SubViewHeader>

      {logs && logs.size > 0 ?
        <Section>
          <ul className={`${block}__list`}>
            <div className={`${block}__heading`}>
              <h3>
                Recent events
              </h3>
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
                <DownloadButton className={`${block}__download-link`}>
                  <AuditLogDownloadView logEntry={logEntry} />
                </DownloadButton>
              </li>
            )}
          </ul>
        </Section>
      : null}
    </SubViewWrapper>
  );
});
