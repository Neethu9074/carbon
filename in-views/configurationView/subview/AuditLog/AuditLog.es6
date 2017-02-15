import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import createAuditLogSubscription from 'in-services/subscription/auditLog';
import Section from 'in-views/configurationView/components/Section';
import connectTo from 'in-hoc/connectTo';

import 'in-views/configurationView/subview/AuditLog/AuditLog.less';


const block = 'in-audit-log';

export default connectTo({
  logs: createAuditLogSubscription()
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
            {logs.map(log =>
              <li key={log.get('id')}
                  className={`${block}__item`}>
                {log.get('id')}
              </li>
            )}
          </ul>
        </Section>
      : null}
    </SubViewWrapper>
  );
});
