/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export default function TopProcessUserNameList(props: any) {
  const serviceName = props['serviceName'].split('_');
  const userName = `${
    serviceName[1]?.toLowerCase() == null || serviceName[1]?.toLowerCase().trim() === ''
      ? ''
      : serviceName[1]?.toLowerCase()
  }adm`;

  return [
    {
      value: userName,
      label: userName
    },
    {
      value: 'messagebus',
      label: t('in-sap:dashboards.messagebus')
    },
    {
      value: 'sapadm',
      label: t('in-sap:dashboards.sapadm')
    },
    {
      value: 'root',
      label: t('in-sap:dashboards.root')
    }
  ];
}
