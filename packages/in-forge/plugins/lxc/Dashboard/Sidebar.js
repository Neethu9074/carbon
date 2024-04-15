/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Info from 'in-forge/plugins/lxc/Info';
import { t } from 'in-i18n';

export default function LxcSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.lxc.lxcContainer')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
