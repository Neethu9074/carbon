/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function EumWebsiteInfo({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  const websiteId = data.get('key');
  const websiteHref = useLinkToWebsite(websiteId);
  const lastModified = data.get('lastModified');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.eum.websiteName')}>
        <a href={websiteHref}>{data.get('name')}</a>
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.webserverType')}>{data.get('wsType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.websitekey')}>{websiteId}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.enabled')}>
        {data.get('enabled') ? t('in-forge:plugins.eum.true') : t('in-forge:plugins.eum.false')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.aggressive')}>
        {data.get('aggressive') ? t('in-forge:plugins.eum.true') : t('in-forge:plugins.eum.false')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.contentTypes')}>
        {data.get('contentTypes', emptyList).join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.trackSessions')}>
        {data.get('trackSessions') ? t('in-forge:plugins.eum.true') : t('in-forge:plugins.eum.false')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.jsAgentUrl')}>{data.get('jsAgentUrl')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.reportingUrl')}>{data.get('reportingUrl')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.eum.mode')}>{data.get('mode')}</DescriptionItem>
      {lastModified && (
        <DescriptionItem title={t('in-forge:plugins.eum.lastModified')}>
          {formatDateTime(lastModified)} ({fromNowAccurately(lastModified)})
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
