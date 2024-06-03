/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { SyntheticTest, TestResultListItem } from '@instana/types';
import { IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { showUpdateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { TestResponse, dummyTest } from 'in-synthetics/utils/constants';
import hasEmptyStrings from 'in-synthetics/utils/hasEmptyStrings';
import { getTest, updateTest } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

const ListActionsColumn = ({ testResultCommonProperties }: TestResultListItem) => {
  const [reloadCount, setReloadCount] = useState(0);

  const testId: string = testResultCommonProperties?.testCommonProperties?.id ?? '';
  const totalLocations: number = testResultCommonProperties?.testCommonProperties?.locationIds?.length ?? 0;

  const syntheticTest: TestResponse = useObservable<any, [number]>(() => getTest(testId), [reloadCount]) || dummyTest;
  const active: boolean = syntheticTest.data?.active || false;
  const pauseResume: string = active
    ? `${t('in-synthetics:dashboard.testList.pause')}`
    : `${t('in-synthetics:dashboard.testList.resume')}`;

  const pauseOrResume = (test: SyntheticTest) => {
    const { active, customProperties, configuration } = test;
    const syntheticType: string = configuration.syntheticType;
    let updatedConfiguration = configuration;

    if (syntheticType === 'HTTPAction') {
      updatedConfiguration = {
        ...configuration,
        // @ts-expect-error headers property can be available for some test types
        headers: hasEmptyStrings(configuration?.headers) ? {} : configuration.headers
      };
    }

    const testConfig: SyntheticTest = {
      ...test,
      active: !active,
      customProperties: hasEmptyStrings(customProperties || {}) ? {} : customProperties,
      configuration: updatedConfiguration
    };

    updateTest(testConfig).once(
      () => {
        setReloadCount(count => ++count);
      },
      error => {
        showUpdateErrorMessage(deserializeErrorMessage(error.message));
      }
    );
  };

  // For tests without location(s), disable the Pause/Resume button
  return (
    <Tooltip content={pauseResume}>
      <IconButton
        kind="primaryv2"
        type={active ? 'lib_actions_pause' : 'lib_actions_play'}
        iconSpinning={syntheticTest.progress.loading}
        onClick={() => pauseOrResume(syntheticTest.data)}
        alignment="right"
        disabled={totalLocations > 0 ? false : true}
      />
    </Tooltip>
  );
};

export default ListActionsColumn;
