/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Button, Card } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error Source needs to be converted to TS
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
// @ts-expect-error Source needs to be converted to TS
import FloatingActionButton from 'in-components/FloatingActionButton';
import TestConfigDialogPresenter from 'in-synthetics/components/TestConfigDialogPresenter';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { dummyLocations } from 'in-synthetics/utils/contants';
import { Progress, SyntheticTest } from 'in-types';
import { getTests } from 'in-synthetics/api';
import { t } from 'in-i18n';

import locals from './Tests.mless';

export interface TestsResponse {
  data?: SyntheticTest[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export default function Tests() {
  const tests: TestsResponse = useObservable<any, []>(() => getTests(), []) || dummyLocations;

  function onAddWidget() {
    addActiveDialog(
      <TestConfigDialogPresenter
        onClose={() => {
          close();
        }}
      />
    );
  }

  if (tests?.progress?.loading) {
    return <LoadingIndicator size="regular" />;
  }
  if (!tests.data?.filter(Boolean)?.length) {
    return (
      <div className={classNames(locals.dashboard, locals.flex)}>
        <NoDataAvailable text={'No tests added'} />
        <Button onClick={onAddWidget}>{t('in-synthetics:createTest.buttonLabel')}</Button>
      </div>
    );
  }

  return (
    <>
      <div>
        {tests.data.filter(Boolean)?.map(test => (
          <Card key={test.id}>
            <>
              <h3>{test.label}</h3>
              <span>{test.description}</span>
            </>
          </Card>
        ))}
      </div>
      <FloatingActionButtons>
        <FloatingActionButton onClick={onAddWidget} withBoxShadow icon="lib_line_chart">
          {t('in-synthetics:createTest.buttonLabel')}
        </FloatingActionButton>
      </FloatingActionButtons>
    </>
  );
}
