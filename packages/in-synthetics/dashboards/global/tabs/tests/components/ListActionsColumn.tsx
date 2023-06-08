/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { Progress, SyntheticTest, TestResultListItem } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { showUpdateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import IconButton from 'in-components/IconButton/IconButton';
import { dummyTest } from 'in-synthetics/utils/constants';
import { getTest, updateTest } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

type Props = {
  item: TestResultListItem;
  isLoading: boolean;
};

type TestResponse = {
  data?: SyntheticTest;
  errors?: Error[];
  progress: Progress;
  time?: number;
};

export default function ListActionsColumn({ item, isLoading }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const [edittingTests, setEdittingTests] = useState<Record<string, boolean>>({});
  const [reloadCount, setReloadCount] = useState(0);

  const testId: string = item?.testResultCommonProperties?.testCommonProperties?.id ?? '';
  const totalLocations: number = item?.testResultCommonProperties?.testCommonProperties?.locationIds?.length ?? 0;

  const syntheticTest: TestResponse = useObservable<any, [number]>(() => getTest(testId), [reloadCount]) || dummyTest;
  const active: boolean = syntheticTest.data?.active || false;
  const pauseResume: string = active
    ? `${t('in-synthetics:dashboard.testList.pause')}`
    : `${t('in-synthetics:dashboard.testList.resume')}`;

  function reloadTests() {
    setReloadCount(count => ++count);
  }

  useEffect(() => {
    if (!isLoading && (isSaving || isMoreMenuSaving)) {
      setIsSaving(false);
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when is loading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  function pauseOrResume(test: SyntheticTest) {
    const { active } = test;

    setEdittingTests(edittingTests => {
      return { ...edittingTests, [`${test.id}`]: true };
    });

    updateTest({ ...test, active: !active }).once(
      () => {
        setEdittingTests(edittingTests => {
          return { ...edittingTests, [`${test.id}`]: false };
        });
        reloadTests();
      },
      () => {
        setEdittingTests({ ...edittingTests, [`${test.id}`]: false });
        showUpdateErrorMessage();
      }
    );
  }

  // For tests without location(s), disable the Pause/Resume button
  return (
    <Tooltip content={pauseResume}>
      <IconButton
        kind="primaryv2"
        type={isMoreMenuSaving ? 'lib_actions_loading' : active ? 'lib_actions_pause' : 'lib_actions_play'}
        iconSpinning={isMoreMenuSaving}
        // @ts-expect-error Type 'undefined' is not assignable to type 'SyntheticTest'.
        onClick={() => pauseOrResume(syntheticTest.data)}
        alignment="right"
        disabled={totalLocations > 0 ? false : true}
      />
    </Tooltip>
  );
}
