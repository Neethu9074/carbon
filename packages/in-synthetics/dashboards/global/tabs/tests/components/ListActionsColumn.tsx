/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { Progress, SyntheticTest, TestResultListItem } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  showUpdateErrorMessage,
  showDeleteSuccessMessage,
  showDeleteErrorMessage
} from 'in-synthetics/components/utils/userFeedback';
//import Tooltip from 'in-components/Tooltip/Tooltip';
import { stopPropagation } from 'in-services/util/function';
// @ts-expect-error
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { getTest, updateTest, removeTest } from 'in-synthetics/api';
import IconButton from 'in-components/IconButton/IconButton';
import { dummyTest } from 'in-synthetics/utils/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './ListActionsColumn.mless';

type Props = {
  item: TestResultListItem;
  isLoading: boolean;
};

export default function ListActionsColumn({ item, isLoading }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const [edittingTests, setEdittingTests] = useState<Record<string, boolean>>({});
  const [reloadCount, setReloadCount] = useState(0);
  const testId: string = item?.testResultCommonProperties?.testCommonProperties?.id ?? '';
  const testLabel: string = item?.testResultCommonProperties?.testCommonProperties?.label ?? '';
  const active: boolean = item?.testResultCommonProperties?.testCommonProperties?.active ?? true;
  const pauseResume: string = active
    ? `${t('in-synthetics:dashboard.testList.pause')}`
    : `${t('in-synthetics:dashboard.testList.resume')}`;

  type TestResponse = {
    data?: SyntheticTest;
    errors?: Error[];
    progress: Progress;
    time?: number;
  };

  const syntheticTest: TestResponse = useObservable<any, [number]>(() => getTest(testId), [reloadCount]) || dummyTest;

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

  function deleteTest(testId: string) {
    addActiveDialog(
      <ConfirmationDialog
        header={t('in-synthetics:dashboard.testList.labelConfirm')}
        description={
          <span>
            <Trans i18nKey="in-synthetics:dashboard.testList.labelConfirmRemoveTest" values={{ testLabel }} />
          </span>
        }
        confirmButtonLabel={t('in-synthetics:dashboard.testList.labelRemove')}
        onSubmit={() => {
          close();
          removeTest(testId).once(
            () => {
              showDeleteSuccessMessage();
              reloadTests();
            },
            () => {
              showDeleteErrorMessage();
            }
          );
        }}
      />
    );
  }

  return (
    <HorizontalFlexWrapper className={locals.actions}>
      <Tooltip content={pauseResume}>
        <IconButton
          kind="primaryv2"
          type={isMoreMenuSaving ? 'lib_actions_loading' : active ? 'lib_actions_pause' : 'lib_actions_play'}
          iconSpinning={isMoreMenuSaving}
          // @ts-expect-error
          onClick={() => pauseOrResume(syntheticTest.data)}
          alignment="right"
        />
      </Tooltip>
      <MoreMenu
        renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
          <IconButton
            kind="info"
            type="lib_menu_more_horizontal"
            onClick={e => {
              stopPropagation(e);
              toggle();
            }}
            ref={ref as React.MutableRefObject<HTMLButtonElement>}
          />
        )}
      >
        <MoreMenuButton icon="lib_actions_delete" onClick={() => deleteTest(testId)}>
          {t('in-synthetics:dashboard.testList.delete')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
}
