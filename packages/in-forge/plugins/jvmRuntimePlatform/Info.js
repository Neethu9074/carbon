/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ClasspathLayouter from 'in-sdk/components/sidebar/ClassPathLayouter';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function JVMInfo({ snapshot }) {
  const data = snapshot.get('data');
  const maxMemory = data.get('memory.max');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.javaVersion')}>
        {data.get('jvm.version')} {data.get('jvm.build')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.javaRuntime')}>
        {data.get('jvm.vendor')}
        <br />
        {data.get('jvm.name')}
      </DescriptionItem>

      {maxMemory ? (
        <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.maximumHeap')}>
          {bytesTwoDecimalPlaces(maxMemory)}
        </DescriptionItem>
      ) : null}

      <DescriptionItem title={t('in-forge:plugins.jvmRuntimePlatform.classpath')}>
        <ClasspathLayouter classpath={data.get('jvm.cp')} />
      </DescriptionItem>
    </DescriptionList>
  );
}
