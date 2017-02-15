import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import createAuditLogSubscription from 'in-services/subscription/auditLog';
import Section from 'in-views/configurationView/components/Section';
import DownloadButton from 'in-components/DownloadButton';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/AuditLog/AuditLog.less';


const block = 'in-audit-log';

export default connectTo({
  logs: createAuditLogSubscription({
    to: null,
    windowSize: 60000
  })
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
                <div>
                  {logEntry.get('id')}
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
