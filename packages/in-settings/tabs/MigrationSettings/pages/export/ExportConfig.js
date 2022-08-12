/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import { getConfigData } from 'in-settings/tabs/MigrationSettings/api/exportConfig';
import { MIGRATION_CONFIGS } from '../../components/MigrationTypes';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

const EXPORT_CONFIG_FILE_NAME = 'config-export.json';

export default function ExportConfig() {
  return (
    <ApiItemView
      saveLabel={t('in-settings:tabs.migrationExport')}
      enrichForm={enrichForm}
      render={render}
      saveItem={saveItem}
    />
  );
}

function downloadConfigs(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function getSelectedConfigIds(selectedConfigs) {
  let selectedIds = [];
  if (selectedConfigs) {
    let configIds = Object.keys(selectedConfigs);
    Object.values(selectedConfigs).forEach((config, index) => {
      if (config.value) {
        selectedIds.push(configIds[index]);
      }
    });
  }
  return selectedIds;
}

function saveItem({ form, setMessage }) {
  let selectedConfigIds = getSelectedConfigIds(form.items);
  setMessage({
    message: t('in-settings:tabs.exportingConfig'),
    type: 'neutral',
    isSaving: true
  });
  const configResult$ = getConfigData(selectedConfigIds);
  configResult$.once(
    resp => {
      setMessage({
        text: t('in-settings:tabs.configSuccessfullyExported'),
        type: 'success'
      });
      downloadConfigs(JSON.stringify(resp), EXPORT_CONFIG_FILE_NAME, 'text/plain');
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToExportConfig', { err: error.message }),
        type: 'error'
      })
  );
}

function render({ form, setForm, setCanSaveItem }) {
  if (form.get('firstLoad').value) {
    setCanSaveItem(true);
    setForm(form.updateIn(['firstLoad'], f => f.setValue(false)));
  }

  return (
    <>
      <Title title={t('in-settings:tabs.configExport')} />
      <SubViewHeader>{t('in-settings:tabs.configExport')}</SubViewHeader>
      <SectionLine />
      <h2>{t('in-settings:tabs.downloadTheConfigurationData')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configExportHelp" />
      </p>
      <form>
        <Section>
          <FormGroup>
            {MIGRATION_CONFIGS.map(config =>
              form.get(config.type).map(field => (
                <CheckboxFancy
                  key={config.type}
                  id={config.type}
                  disabled
                  label={<IconLabel type={config.icon} text={config.label} noBottomMargin />}
                  checked={field.value}
                  onChange={e => {
                    setForm(form.updateIn([config.type], f => f.setValue(e.target.checked).setTouched(true)));
                    if (e.target.checked) {
                      setCanSaveItem(e.target.checked);
                    } else {
                      // need to check that at least one other configuration type is selected to enable Save button
                      let selectedIds = getSelectedConfigIds(form.items);
                      if (selectedIds.length > 1 || (selectedIds.length === 1 && !selectedIds.includes(config.type))) {
                        setCanSaveItem(true);
                      } else {
                        setCanSaveItem(false);
                      }
                    }
                  }}
                  size="larger"
                />
              ))
            )}
          </FormGroup>
        </Section>
      </form>
    </>
  );
}

/**
 * Default is for all checkboxes to be checked and Export button enabled

 * @param {*} form
 * @returns updated form
 */
function enrichForm(form) {
  form = form.put(
    'firstLoad',
    createField({
      value: true
    })
  );
  MIGRATION_CONFIGS.forEach(conf => {
    form = form.put(
      conf.type,
      createField({
        value: true
      })
    );
  });
  return form;
}
