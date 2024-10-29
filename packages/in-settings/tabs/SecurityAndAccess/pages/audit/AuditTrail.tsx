/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { ButtonGroup, Spacer } from '@instana/components';

import {
  securityAndAccessAccessLog,
  securityAndAccessActionLog,
  securityAndAccessActionLogRetention
} from 'in-settings/navigation/paths';
import ActionLog from 'in-settings/tabs/SecurityAndAccess/pages/audit/ActionLog';
import AccessLog from 'in-settings/tabs/SecurityAndAccess/pages/audit/AccessLog';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

enum Tab {
  ActionLog = 'ActionLog',
  AccessLog = 'AccessLog'
}

export default function AuditTrail() {
  const { location, goToPath } = useNavigation();
  const [visible, setVisible] = useState<Tab>(Tab.ActionLog);

  useEffect(() => {
    if (location.pathname === securityAndAccessActionLog || location.pathname === securityAndAccessActionLogRetention) {
      setVisible(Tab.ActionLog);
    } else if (location.pathname === securityAndAccessAccessLog) {
      setVisible(Tab.AccessLog);
    } else {
      goToPath(securityAndAccessActionLog);
    }
  }, [location, goToPath]);

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.auditTrail')} />
      <SubViewHeader>{t('in-settings:tabs.auditTrail')}</SubViewHeader>
      <ButtonGroup
        id="button-group-audit-trail"
        activeKey={visible}
        buttonPropsList={[
          {
            key: Tab.ActionLog,
            onClick: () => goToPath(securityAndAccessActionLog),
            text: t('in-settings:tabs.actionLog')
          },
          {
            key: Tab.AccessLog,
            onClick: () => goToPath(securityAndAccessAccessLog),
            text: t('in-settings:tabs.accessLog')
          }
        ]}
      />
      <Spacer vertical="medium" />
      {visible === Tab.ActionLog ? <ActionLog /> : <AccessLog />}
    </SettingsDetailPage>
  );
}
