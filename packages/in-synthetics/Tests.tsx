/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import {
  showUpdateErrorMessage,
  showDeleteSuccessMessage,
  showDeleteErrorMessage
} from 'in-synthetics/components/utils/userFeedback';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { columnDefinitions } from 'in-synthetics/utils/columnDefinitions';
import { updateTest, removeTest } from 'in-synthetics/api';
import { Progress, SyntheticTest } from 'in-types';

export interface TestsResponse {
  data?: SyntheticTest[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

interface Props {
  tests: SyntheticTest[];
  isLoading: boolean;
  reloadTests: () => void;
}

export default function Tests({ tests, isLoading, reloadTests }: Props) {
  const [edittingTests, setEdittingTests] = useState<Record<string, boolean>>({});

  function pauseOrResume(test: SyntheticTest) {
    const selectedTest = tests.find(({ id }) => id === test.id);
    if (!selectedTest) return;

    const { active } = selectedTest;

    setEdittingTests(edittingTests => {
      return { ...edittingTests, [`${test.id}`]: true };
    });

    updateTest({ ...selectedTest, active: !active }).once(
      () => {
        setEdittingTests(edittingTests => {
          return { ...edittingTests, [`${test.id}`]: false };
        });
        tests = tests.map(eachTest => {
          if (eachTest.id === test.id) {
            return { ...eachTest, active: !active };
          } else {
            return eachTest;
          }
        });
      },
      () => {
        setEdittingTests({ ...edittingTests, [`${test.id}`]: false });
        showUpdateErrorMessage();
      }
    );
  }

  function deleteTest(id: string) {
    removeTest(id).once(
      () => {
        showDeleteSuccessMessage();
        reloadTests();
      },
      () => {
        showDeleteErrorMessage();
      }
    );
  }

  if (isLoading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  return (
    <Ul>
      {tests.map(test => (
        <Li key={test.id}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            test={test}
            pauseOrResume={pauseOrResume}
            isSubmitting={edittingTests[`${test.id}`]}
            deleteTest={deleteTest}
          />
        </Li>
      ))}
    </Ul>
  );
}
