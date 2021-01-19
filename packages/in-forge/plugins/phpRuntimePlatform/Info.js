/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function PhpRuntimePlatformInfo({ snapshot, initiallyOpen = true }) {
  return (
    <Collapsible initiallyOpen={initiallyOpen}>
      <Collapsible.Header>PHP</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title="Version">{snapshot.getIn(['data', 'version'])}</DescriptionItem>
          <DescriptionItem title="Server API">{snapshot.getIn(['data', 'serverApi'])}</DescriptionItem>
          <DescriptionItem title="Zend Thread Safety">{snapshot.getIn(['data', 'zts'])}</DescriptionItem>
          <DescriptionItem title="Main Ini File">{snapshot.getIn(['data', 'iniFile'])}</DescriptionItem>
          <DescriptionItem title="Ini Files Directory">{snapshot.getIn(['data', 'iniDir'])}</DescriptionItem>
          <DescriptionItem title="Additional Ini Files Parsed">
            {stripIniDir(snapshot.getIn(['data', 'iniFilesParsed']), snapshot.getIn(['data', 'iniDir']))}
          </DescriptionItem>
          <DescriptionItem title="Extensions Directory">{snapshot.getIn(['data', 'extensionsDir'])}</DescriptionItem>
          <DescriptionItem title="Instana Tracing Extension Version">
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
