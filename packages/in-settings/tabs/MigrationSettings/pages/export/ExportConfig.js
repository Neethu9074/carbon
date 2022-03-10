/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Export.mless';

export default function ExportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  return (
    <ApiItemView
      input={input}
      file={file}
      onCancelClick={() => {
        setFile(null);
        // refresh();
      }}
      saveItem={({ setMessage }) => {
        if (file == null) {
          setMessage({
            text: t('in-settings:tabs.failedToSaveConfig', { err: t('in-settings:tabs.IdPMetadataRequired') }),
            type: 'error'
          });
          return;
        }
        const reader = new FileReader();

        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt) {
          if (evt.target.result.length > 2000000) {
            setMessage({
              text: t('in-settings:tabs.failedToSaveConfig', {
                err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
              }),
              type: 'error'
            });
            return;
          }
        };
      }}
      Content={Content}
    />
  );
}

function Content({ file, form, setCanSaveItem }) {
  useEffect(
    // allow only saving when idP metadata has been uploaded
    () => setCanSaveItem(!!file),
    [file, form, setCanSaveItem]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configExport')} />
      <SubViewHeader>{t('in-settings:tabs.configExport')}</SubViewHeader>

      <h2>{t('in-settings:tabs.downloadTheConfigurationDataSummary')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configExportHelp" />
      </p>

      <form method="post" encType="multipart/form-data">
        <Section restrictWidth="50rem">
          <h2>{t('in-settings:tabs.configExport')}</h2>
          <Button kind="secondary" icon="lib_actions_download" href={`/api/settings/export-configuration/`}>
            {t('in-settings:tabs.configurationMetadata')}
          </Button>

          <ul className={locals.list}>
            <li>{t('in-settings:tabs.downloadTheConfigurationData')}</li>
            <li>{t('in-settings:tabs.useImportToUploadConfigurationData')}</li>
          </ul>
        </Section>
      </form>
    </>
  );
}
