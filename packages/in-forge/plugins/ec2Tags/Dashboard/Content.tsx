/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { Card, KeyValue, Li, Ul } from '@instana/components';
import { t } from '@instana/i18n-react';

import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function Ec2TagsDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const tags = Object.entries((snapshot.get('data')?.get('tags') as Map<string, string>).toObject());
  return (
    <Card title={t('in-sdk:sidebar.tags', { size: tags.length })}>
      <Ul>
        {tags.map(([key, value]) => (
          <Li key={key}>
            <KeyValue value={value} label={key} />
          </Li>
        ))}
      </Ul>
    </Card>
  );
}
