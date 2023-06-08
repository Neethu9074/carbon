/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, ReactNode } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { createLogger } from '@instana/logger';

import { showUpdateSuccessMessage, showUpdateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import AdvancedMode from 'in-synthetics/components/advanced/AdvancedMode';
import { createForm } from 'in-synthetics/form/updateSyntheticTestForm';
import { SlideInHeader } from 'in-synthetics/utils/constants';
import { updateTest } from 'in-synthetics/api';
import { SyntheticTest } from 'in-types';
import { t } from 'in-i18n';

import locals from './EditConfigurationDialogPresenter.mless';

const logger = createLogger('in-synthetics/components/TestConfigDialogPresenter');

export interface SlideInConfig {
  title?: string;
  component?: ReactNode;
}

export interface SliderState {
  slideInConfig?: SlideInConfig;
  isVisible: boolean;
}
interface Props {
  test: SyntheticTest;
  onClose: () => void;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function EditConfigurationDialogPresenter({ test, onClose, setReloadCount }: Props) {
  const testId: string = test.id || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => createForm(test));
  const [slideInConfig, setSlideInConfig] = useState<SlideInConfig | null>(null);
  const [slideInViewVisible, setSlideInViewVisible] = useState<boolean>(false);
  const [renderSectionsCounter, setRenderSectionsCounter] = useState(1);
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({
    syntheticType: test.configuration.syntheticType,
    url: form.get('configuration').get('url')?.value,
    testFrequency: form.get('testFrequency').value,
    locations: form.get('locations').value,
    label: form.get('label').value,
    description: form.get('description').value,
    applicationId: form.get('applicationId').value,
    script: form.get('script')?.value
  });
  const syntheticType = test.configuration.syntheticType;
  const [testTypeSelected, setTestTypeSelected] = useState({
    simple: syntheticType === 'HTTPAction',
    script: syntheticType === 'HTTPScript'
  });
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });
  const formId = 'create-synthetics-test-form';

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  function onSubmit(form: MapForm<any>) {
    setIsSubmitting(true);
    let testConfig: SyntheticTest;
    let updatedForm: MapForm<any>;
    if (
      form.get('configuration').get('syntheticType').value !== 'HTTPScript' &&
      isEmpty(form.get('configuration').get('headers').value)
    ) {
      updatedForm = form.put('configuration', form.get('configuration').remove('headers'));
      testConfig = {
        active: true,
        id: testId,
        ...updatedForm.toJS()
      } as SyntheticTest;
    } else {
      testConfig = {
        id: testId,
        active: true,
        ...form.toJS()
      } as SyntheticTest;
    }

    updateTest(testConfig).once(
      () => {
        onClose();
        setReloadCount((count: number) => ++count);
        showUpdateSuccessMessage();
      },
      error => {
        setIsSubmitting(false);
        showUpdateErrorMessage();
        logger.error(`failed to save updated test configuration : ${testConfig} ${error.message}`, error);
      }
    );
  }

  const footer = (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />
      <SaveButton
        type="submit"
        kind="primary"
        formId={formId}
        form={form}
        isSaving={isSubmitting}
        disabled={isSubmitting}
      >
        {t('in-synthetics:dialog.updateTest.buttonSave')}
      </SaveButton>
    </FormFooter>
  );

  return (
    <DialogWithSlideInView
      footer={footer}
      title={t('in-synthetics:dialog.updateTest.dialogTitle')}
      slideInViewTitle={customSlideInHeaderConfig?.title ?? slideInConfig?.title}
      onSlideInViewTitleClick={() =>
        customSlideInHeaderConfig.onClose
          ? customSlideInHeaderConfig.onClose()
          : setSlideInViewVisible(!slideInViewVisible)
      }
      titleIconType="lib_line_chart"
      onClose={onClose}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      removeBottomPaddingWhenFooterIsShown
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form);
        }}
        className={classNames({
          [locals.form]: true,
          [locals.advancedMode]: true
        })}
      >
        <AdvancedMode
          form={form}
          updateForm={setForm}
          setSliderState={setSliderState}
          testTypeSelected={testTypeSelected}
          setTestTypeSelected={setTestTypeSelected}
          renderSectionsCounter={renderSectionsCounter}
          setRenderSectionsCounter={setRenderSectionsCounter}
          commonAttributes={commonAttributes}
          setCommonAttributes={setCommonAttributes}
          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          isUpdateConfig
        />
      </form>
    </DialogWithSlideInView>
  );
}
