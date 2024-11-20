/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { SubtraceConfigForm } from 'in-applications/Forms/SubtraceConfiguration/SubtraceConfigForm';
import { SubtraceTabData } from 'in-applications/Dashboards/subtrace/tabs';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { Nullish } from 'in-types';

interface SubtraceConfigurationWrapperProps {
  data: SubtraceTabData | Nullish;
}

interface SubtraceConfigurationProps {
  subtraceTabData: SubtraceTabData;
}

const SubtraceConfigurationContent = ({ subtraceTabData }: SubtraceConfigurationProps) => {
  const subtrace = subtraceTabData as Subtrace;

  return (
    <Card title={t('in-applications:subtraces.configuration.title')}>
      <SubtraceConfigForm subtrace={subtrace} />
    </Card>
  );
};

export function SubtraceConfiguration({ data: subtrace }: SubtraceConfigurationWrapperProps) {
  if (!subtrace || !subtrace.id) {
    return null;
  }
  return <SubtraceConfigurationContent subtraceTabData={subtrace} />;
}
