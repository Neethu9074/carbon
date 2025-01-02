/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

export function supportViewData() {
  return [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.unix.previewPrerequisites')}
            href="https://ibm.biz/insta-agent-unix-prereqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.unix.installingInstanaAgent')}
            href="https://ibm.biz/insta-agent-unix-install"
          />
        </Stack>
      ),
      openByDefault: true
    }
  ];
}

export function getPlatformArchitectures(agentMode: string) {
  if (agentMode === 'dynamic') {
    return [
      {
        key: 'sparc64',
        searchKey: 'solaris',
        label: t('in-waiting-for-deployment:content.solaris64BitSparc')
      },
      {
        key: 'sparc32',
        searchKey: 'solaris',
        label: t('in-waiting-for-deployment:content.solaris32BitSparc')
      },
      {
        key: 'aix64',
        searchKey: 'aix',
        label: t('in-waiting-for-deployment:content.aix64BitPowerPc')
      },
      {
        key: 'aix32',
        searchKey: 'aix',
        label: t('in-waiting-for-deployment:content.aix32BitPowerPc')
      }
    ];
  } else {
    return [
      {
        key: 'sparc64Static',
        searchKey: 'solaris',
        label: t('in-waiting-for-deployment:content.solaris64BitSparc')
      },
      {
        key: 'sparc32Static',
        searchKey: 'solaris',
        label: t('in-waiting-for-deployment:content.solaris32BitSparc')
      },
      {
        key: 'aix64Static',
        searchKey: 'aix',
        label: t('in-waiting-for-deployment:content.aix64BitPowerPc')
      },
      {
        key: 'aix32Static',
        searchKey: 'aix',
        label: t('in-waiting-for-deployment:content.aix32BitPowerPc')
      }
    ];
  }
}
