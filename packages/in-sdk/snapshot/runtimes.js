/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

const runtimes = [
  {
    key: 'dotnet',
    label: t('in-sdk:snapshot.runtimeLabelNet')
  },
  {
    key: 'go',
    label: t('in-sdk:snapshot.runtimeLabelGo')
  },
  {
    key: 'java',
    label: t('in-sdk:snapshot.runtimeLabelJava')
  },
  {
    key: 'node',
    label: t('in-sdk:snapshot.runtimeLabelNodeJS')
  },
  {
    key: 'php',
    label: t('in-sdk:snapshot.runtimeLabelPhp')
  },
  {
    key: 'python',
    label: t('in-sdk:snapshot.runtimeLabelPython')
  },
  {
    key: 'ruby',
    label: t('in-sdk:snapshot.runtimeLabelRuby')
  }
];

const unknownRuntime = {
  key: 'unknown',
  label: t('in-sdk:snapshot.runtimeLabelUnknown')
};

export function getRuntimeByKey(key) {
  if (!key) {
    return unknownRuntime;
  }
  const runtime = runtimes.find(runtime => key.indexOf(runtime.key) >= 0);
  if (runtime) {
    return runtime;
  }
  return unknownRuntime;
}
