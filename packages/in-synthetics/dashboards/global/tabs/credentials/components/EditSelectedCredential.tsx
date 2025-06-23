/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { Field } from 'formalistic';

import { Stack, Typography } from '@instana/components';
import { SyntheticCredential } from '@instana/types';

import EditCredentialInputs from 'in-synthetics/dashboards/global/tabs/credentials/components/EditCredentialInputs';
import editCredentialForm from 'in-synthetics/dashboards/global/tabs/credentials/components/editCredentialForm';
import { showUpdateErrorMessage, showUpdateSuccessMessage } from 'in-synthetics/createTests/utils/userFeedback';
import AssociationsCommonSection from 'in-synthetics/createTests/wizard/AssociationsCommonSection';
import { syntheticCredentialEditSubmitButtonClick } from 'in-synthetics/tracking/tracker';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SlideInConfig, SliderState } from 'in-synthetics/utils/constants';
import TeamsStep from 'in-synthetics/createTests/wizard/TeamsStep';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { close } from 'in-components/DialogPresenter/store';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import CancelButton from 'in-components/form/CancelButton';
import { updateCredential } from 'in-synthetics/api';
import Actions from 'in-components/Dialog/Actions';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialListActionsColumn.mless';

interface Props {
  item: SyntheticCredential;
}

const EditSelectedCredential = ({ item }: Props) => {
  const [form, updateForm] = useState(() => editCredentialForm(item));
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideConfig] = useState<SlideInConfig | null>(null);
  const credentialValueField = form.get('credentialValue') as Field<string>;
  const { trackCta } = useSegmentTracking();

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  const handleEditCredential = () => {
    syntheticCredentialEditSubmitButtonClick(trackCta);
    let credentialConfig: SyntheticCredential;

    credentialConfig = {
      credentialName: '',
      credentialValue: '',
      ...form.toJS()
    } as SyntheticCredential;

    const result$ = updateCredential(credentialConfig);

    result$.once(
      _result => {
        showUpdateSuccessMessage('credential');
        close();
        window.location.reload();
      },
      error => {
        showUpdateErrorMessage(deserializeErrorMessage(error.message), 'credential');
        close();
      }
    );
  };

  return (
    <DialogWithSlideInView
      title={t('in-synthetics:dialog.createCredential.edit.dialogTitle', {
        credentialName: item?.credentialName
      })}
      onClose={close}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      slideInViewTitle={slideInConfig?.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
    >
      <LeftRightPadding className={locals.editDialog}>
        <EditCredentialInputs form={form} updateForm={updateForm} />
        <Stack gap="xsmall">
          <Typography variant="heading-400">{t('in-synthetics:dialog.createCredential.edit.associations')}</Typography>
          <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
        </Stack>
        {rbacTeamsEnabled && (
          <Stack gap="xsmall">
            <Typography variant="heading-400">{t('in-synthetics:dialog.createCredential.teams')}</Typography>
            <TeamsStep form={form} updateForm={updateForm} />
          </Stack>
        )}
        <Actions>
          <CancelButton onClick={close} />
          <SaveButton
            onClick={handleEditCredential}
            kind="primary"
            disabled={!credentialValueField.valid && credentialValueField.touched}
          >
            {t('in-synthetics:dialog.createCredential.edit.saveButton')}
          </SaveButton>
        </Actions>
      </LeftRightPadding>
    </DialogWithSlideInView>
  );
};

export default EditSelectedCredential;
