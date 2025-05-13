/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { Card, IconButton, LoadingSkeleton, Message, Stack, Typography } from '@instana/components';
import { SyntheticTest } from '@instana/types';
import { Trans, t } from '@instana/i18n-react';
import { Button } from '@instana/components';

import EditConfigurationDialogPresenter from 'in-synthetics/dashboards/summary/tabs/configuration/actions/EditConfigurationDialogPresenter';
import { showDeleteErrorMessage, showDeleteSuccessMessage } from 'in-synthetics/createTests/utils/userFeedback';
import CustomProperties from 'in-synthetics/dashboards/summary/tabs/configuration/sections/CustomProperties';
import ConfigSection from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Configuration';
import { clickSyntheticMonitoringConfigurationTabDeleteTracker } from 'in-synthetics/tracking/tracker';
import Associations from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Associations';
import Locations from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Locations';
import TestType from 'in-synthetics/dashboards/summary/tabs/configuration/sections/TestType';
import Schedule from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Schedule';
import Identify from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Identify';
import { syntheticDnsEnabled, syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { syntheticsPath } from 'in-synthetics/navigation/paths';
import { TestResponse } from 'in-synthetics/utils/constants';
import Header from 'in-components/workspace/Header/Header';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import { removeTest } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface ConfigurationProps {
  test: TestResponse;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

interface ActionButtonProps {
  test: SyntheticTest;
}

const Configuration = ({ test, setReloadCount }: ConfigurationProps) => {
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();
  let testType = null;

  if (test.progress.loading) {
    return <LoadingSkeleton className={locals.skeleton} />;
  }
  if (test.data === undefined || test.data === null || isEmpty(test.data)) {
    return (
      <Card>
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.noDataAvailable.configurationTab', { component: 'Configuration' })}
        />
      </Card>
    );
  }

  const testLabel: string = test.data?.label;

  const openEditConfigDialog = (test: SyntheticTest) => {
    addActiveDialog(
      <EditConfigurationDialogPresenter
        test={test}
        onClose={() => {
          close();
        }}
        setReloadCount={setReloadCount}
      />
    );
  };

  const deleteTest = (testId: string) => {
    addActiveDialog(<DeleteActionDialog testId={testId} />);
  };

  const DeleteActionDialog = ({ testId }: any) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [validationInputValue, setValidationInputValue] = useState('');
    const [reasonInputValue, setReasonInputvalue] = useState('');

    const syntheticValidation: string = 'SYNTHETIC';

    const doDeleteAction = (testId: string) => {
      setIsDeleting(true);

      const action$ = removeTest(testId);

      action$.once(() => {
        setIsDeleting(false);
        showDeleteSuccessMessage('test');
        close();
        goToPath(syntheticsPath);
      });

      action$.errors().once(error => {
        setIsDeleting(false);
        showDeleteErrorMessage(deserializeErrorMessage(error.message), 'test');
        close();
      });
    };

    return (
      <Dialog
        title={t('in-synthetics:dashboard.configuration.dialog.deleteTest')}
        className={locals.dialog}
        onClose={close}
      >
        <section className={locals.confirmationDialogContent}>
          <Typography variant="body-regular">
            <Trans i18nKey="in-synthetics:dashboard.testList.labelConfirmRemoveTest" values={{ testLabel }} />
          </Typography>
          <Message type="warning" withIcon inline>
            {t('in-synthetics:dashboard.configuration.dialog.deleteTestBrowserRefreshInfo')}
          </Message>
          <Label htmlFor="reason">
            {t('in-synthetics:dashboard.configuration.dialog.reasonTitle')}
            <Input
              name="reason"
              value={reasonInputValue}
              disabled={isDeleting}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setReasonInputvalue(target.value);
              }}
            />
          </Label>
          <Label htmlFor="typingValidation">
            {t('in-synthetics:dashboard.configuration.dialog.typingValidationTitle', {
              synthetic: syntheticValidation
            })}
            <Input
              name="typingValidation"
              placeholder={syntheticValidation}
              value={validationInputValue}
              disabled={isDeleting}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setValidationInputValue(target.value);
              }}
            />
          </Label>
        </section>
        <section className={locals.buttons}>
          <Button kind="subtle" onClick={close}>
            {t('in-synthetics:dashboard.configuration.dialog.cancelButton')}
          </Button>
          <Button
            onClick={() => {
              clickSyntheticMonitoringConfigurationTabDeleteTracker(trackCta);
              doDeleteAction(testId);
            }}
            disabled={validationInputValue !== syntheticValidation || isBlank(reasonInputValue)}
            kind="danger"
          >
            {t('in-synthetics:dashboard.configuration.dialog.deleteButton')}
          </Button>
        </section>
      </Dialog>
    );
  };

  const disableEditAction = (testType: string): boolean => {
    const syntheticTestTypes: string[] = [
      'HTTPAction',
      'HTTPScript',
      'BrowserScript',
      'WebpageScript',
      'WebpageAction',
      'SSLCertificate',
      ...(syntheticDnsEnabled ? ['DNS'] : [])
    ];

    // Disable if test type is not in the list of supported test types.
    if (syntheticTestTypes.indexOf(testType) !== -1) {
      return false;
    }

    return true;
  };

  const getEditTooltipContent = (testType: string) => {
    if (disableEditAction(testType)) {
      return t('in-synthetics:dashboard.configuration.configurationUnsupported');
    } else {
      return t('in-synthetics:dashboard.configuration.configurationEditAction');
    }
  };

  const ActionButtons = ({ test }: ActionButtonProps) => {
    const currentTestType: string = test?.configuration?.syntheticType;
    return (
      <Stack gap="xxsmall" direction="horizontal">
        <Tooltip content={getEditTooltipContent(currentTestType)}>
          <IconButton
            type="lib_actions_edit"
            kind="primary"
            disabled={disableEditAction(currentTestType)}
            onClick={() => openEditConfigDialog(test)}
          />
        </Tooltip>
        <Tooltip content={t('in-synthetics:dashboard.configuration.configurationDeleteAction')} delay={500}>
          <IconButton type="lib_actions_delete" kind="primary" onClick={() => deleteTest(test.id || '')} />
        </Tooltip>
      </Stack>
    );
  };

  const renderActionButton = () => {
    if (!role?.canConfigureSyntheticTests) {
      return undefined;
    }
    return <ActionButtons test={test.data} />;
  };

  switch (test.data?.configuration?.syntheticType) {
    case 'HTTPAction':
      testType = 'API Simple';
      break;
    case 'HTTPScript':
      testType = 'API Script';
      break;
    case 'WebpageAction':
      testType = 'Webpage Simple';
      break;
    case 'BrowserScript':
      testType = 'Browser Script';
      break;
    case 'WebpageScript':
      testType = 'Webpage Script';
      break;
    case 'SSLCertificate':
      testType = 'Certificate Check';
      break;
    case 'DNS':
      testType = 'DNS';
      break;
  }

  return (
    <Card
      leftHeaderContent={
        <Header>
          {t('in-synthetics:dashboard.configuration.configurationTitle', {
            testType: testType
          })}
        </Header>
      }
      rightHeaderContent={renderActionButton()}
    >
      <TestType test={test.data} />
      <ConfigSection test={test.data} />
      <Locations test={test.data} />
      <Schedule test={test.data} />
      <Identify test={test.data} />
      {(syntheticRbacLimitedEnabled || syntheticRbacLimitedEnabled) && <Associations test={test.data} />}
      <CustomProperties test={test.data} />
    </Card>
  );
};

export default Configuration;
