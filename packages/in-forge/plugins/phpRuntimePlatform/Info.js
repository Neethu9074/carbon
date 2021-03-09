/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';

export default function PhpRuntimePlatformInfo({ snapshot, initiallyOpen = true }) {
  return (
    <Collapsible initiallyOpen={initiallyOpen}>
      <Collapsible.Header>PHP</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.version')}>
            {snapshot.getIn(['data', 'version'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.serverApi')}>
            {snapshot.getIn(['data', 'serverApi'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.zendThreadSafety')}>
            {snapshot.getIn(['data', 'zts'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.mainIniFile')}>
            {snapshot.getIn(['data', 'iniFile'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.iniFilesDirectory')}>
            {snapshot.getIn(['data', 'iniDir'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.additionalIniFilesParsed')}>
            {stripIniDir(snapshot.getIn(['data', 'iniFilesParsed']), snapshot.getIn(['data', 'iniDir']))}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.extensionsDirectory')}>
            {snapshot.getIn(['data', 'extensionsDir'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.phpRuntimePlatform.instanaTracingExtensionVersion')}>
            {snapshot.getIn(['data', 'instanaVersion'])}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}

function stripIniDir(iniFilesParsed, iniDir) {
  if (iniFilesParsed != null && iniDir != null) {
    return iniFilesParsed
      .split(',')
      .map(function(iniFile) {
        return iniFile.replace(iniDir + '/', '');
      })
      .join(', ');
  }
  return iniFilesParsed;
}
