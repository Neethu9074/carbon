/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { getConfigData } from 'in-settings/tabs/MigrationSettings/api/exportConfig';
import { MIGRATION_CONFIGS } from '../../components/MigrationTypes';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import AccordionConfigs from '../../components/AccordionConfigs';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

export default function ExportConfig() {
  const [selectedConfigTypes, setSelectedConfigTypes] = useState(initSelected());

  return (
    <ApiItemView
      saveLabel={t('in-settings:tabs.migrationExport')}
      Content={Content}
      onSubmit={onSubmit}
      selectedConfigTypes={selectedConfigTypes}
      callBackSelectedConfigs={configs => setSelectedConfigTypes(configs)}
    />
  );
}

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function onSubmit(e, props) {
  e.preventDefault();
  saveItem(props);
}

function getSelectedConfigIds(selectedConfigs) {
  let selectedIds = [];
  if (selectedConfigs) {
    selectedConfigs.forEach(config => {
      if (config.selected) selectedIds.push(config.type);
    });
  }
  return selectedIds;
}

function saveItem({ setMessage, selectedConfigs }) {
  let selectedConfigIds = getSelectedConfigIds(selectedConfigs);
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
      download(JSON.stringify(resp), 'config-export.json', 'text/plain');
    },
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToExportConfig', { err: error.message }),
        type: 'error'
      })
  );
  // }
}

function initSelected() {
  let defaultSelectedConfigs = [];
  MIGRATION_CONFIGS.forEach(configType => {
    let defaultSelectedConfigType = { ...configType, selected: true };
    defaultSelectedConfigs.push(defaultSelectedConfigType);
  });

  return defaultSelectedConfigs;
}

function updateSelectedConfigs(prevSelectedConfigs, selectedConfigType, isSelected) {
  if (prevSelectedConfigs) {
    let updateSelected = [];
    prevSelectedConfigs.forEach(configType => {
      if (configType.type === selectedConfigType) {
        let selectedConfig = { ...configType, selected: isSelected };
        updateSelected.push(selectedConfig);
      } else updateSelected.push(configType);
    });
    return updateSelected;
  }
}

function Content({ setCanSaveItem, callBackSelectedConfigs, selectedConfigTypes }) {
  useEffect(() => {
    setCanSaveItem(true);
    callBackSelectedConfigs(selectedConfigTypes);
  }, [setCanSaveItem, callBackSelectedConfigs, selectedConfigTypes]);

  return (
    <>
      <Title title={t('in-settings:tabs.configExport')} />
      <SubViewHeader>{t('in-settings:tabs.configExport')}</SubViewHeader>
      <SectionLine />
      <h2>{t('in-settings:tabs.downloadTheConfigurationData')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configExportHelp" />
      </p>
      <Section>
        {selectedConfigTypes ? (
          selectedConfigTypes.map(configType => (
            <AccordionConfigs
              key={configType.type}
              label={configType.label}
              icon={configType.icon}
              checked={configType.selected}
              toggleContentOnRowClick={false}
              onChange={changed => {
                const isSelected = Object.keys(changed).length !== 0;
                let updated = updateSelectedConfigs(selectedConfigTypes, configType.type, isSelected);
                callBackSelectedConfigs(updated);
              }}
            />
          ))
        ) : (
          <div>No Configurations</div>
        )}
      </Section>
    </>
  );
}
