/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { FormEvent, useState } from 'react';

import { Observable } from '@instana/observables';

import FileUploadConfigurationDialogPresenter, {
  MessageType
} from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/FileUploadConfigurationDialogPresenter';
import { addSourceMapUploadConfiguration, updateSourceMapUploadConfiguration } from 'in-mobile-apps/api/mobileApps';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { SourceMapUploadConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  mobileAppId: string;
  config?: SourceMapUploadConfig;
  onChange?: (path: Array<string>, value: string) => void;
  onFinished: (message: MessageType) => void;
}

export default function FileUploadConfigurationDialog(props: Props) {
  const { mobileAppId, onFinished } = props;
  const inputConfig = props.config;
  const [form, setForm] = useState<MapForm<any>>(createForm(inputConfig));
  const [message, setMessage] = useState<MessageType | null>(null);

  const extraProps = {
    form,
    message,
    onChange(path: Array<string>, value: string) {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      setForm(form.updateIn(path, field => (field as Field<string>).setValue(value).setTouched(true)));
    },
    onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const newConfig = form.toJS() as unknown as SourceMapUploadConfig;
      let response$: Observable<SourceMapUploadConfig>;
      let successMessage: string;
      setMessage({
        message: t('in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.dialogMessageSavingConfiguration'),
        type: 'success',
        isSaving: true
      });
      if (newConfig.id) {
        response$ = updateSourceMapUploadConfiguration(mobileAppId, newConfig);
        successMessage = t(
          'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.dialogMessageConfigurationUpdated'
        );
      } else {
        response$ = addSourceMapUploadConfiguration(mobileAppId, newConfig);
        successMessage = t(
          'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.dialogMessageNewConfigurationSaved'
        );
      }

      response$.once(
        data => {
          onFinished({ message: successMessage, type: 'success' });
          if (newConfig.id) {
            close();
          } else {
            setMessage({ message: successMessage, type: 'success' });
            setForm(createForm(data));
          }
        },
        error => {
          setMessage({
            message: t(
              'in-mobile-apps:dashboard.tabs.configurations.symbolFileConfig.dialogMessageFailedToSaveConfiguration',
              { message: error.message }
            ),
            type: 'error'
          });
        }
      );
    }
  };

  return <FileUploadConfigurationDialogPresenter {...props} {...extraProps} />;
}

export function createForm(config: SourceMapUploadConfig | undefined) {
  return createMapForm()
    .put(
      'id',
      createField({
        value: config?.id
      })
    )
    .put(
      'description',
      createField({
        value: config?.description ?? '',
        validator: notBlankValidator
      })
    );
}
