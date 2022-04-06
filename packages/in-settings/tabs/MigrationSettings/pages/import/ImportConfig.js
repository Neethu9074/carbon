/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import { MIGRATION_CONFIGS } from '../../components/MigrationTypes';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import AccordionConfigs from '../../components/AccordionConfigs';
import ApiItemView from 'in-settings/components/ApiItemView';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import { shorten } from 'in-services/util/string';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [selectedConfigTypes, setSelectedConfigTypes] = useState(MIGRATION_CONFIGS);

  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  function setImportConfigs(selectedConfigTypes) {
    let cleanedConfigs = {};
    selectedConfigTypes.forEach(configType => {
      if (configType.selected) cleanedConfigs[configType.type] = configType.configs;
    });
    return cleanedConfigs;
  }

  useEffect(() => {
    if (!file) {
      // reset selected configs
      let updatedConfigs = [];
      MIGRATION_CONFIGS.forEach((config, index) => {
        updatedConfigs[index] = { ...config, selected: false, configs: [] };
      });
      setSelectedConfigTypes(updatedConfigs);
    }
  }, [file]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
        }}
        saveLabel={t('in-settings:tabs.migrationImport')}
        saveItem={({ setMessage, selectedConfigTypes }) => {
          let importConfigs = setImportConfigs(selectedConfigTypes);
          if (importConfigs && Object.keys(importConfigs).length !== 0) {
            setMessage({
              message: t('in-settings:tabs.importingConfig'),
              type: 'neutral',
              isSaving: true
            });
            postConfigAsResultObservable(importConfigs).once(
              () => {
                setMessage({
                  text: t('in-settings:tabs.configSuccessfullyImported'),
                  type: 'success'
                });
              },
              error =>
                setMessage({
                  text: t('in-settings:tabs.failedToImportConfig', { err: error.message }),
                  type: 'error'
                })
            );
          }
        }}
        Content={Content}
        selectedConfigTypes={selectedConfigTypes}
        callBackSelectedConfigs={configs => setSelectedConfigTypes(configs)}
      />
    </>
  );
}

function Content({ file, setCanSaveItem, input, callBackSelectedConfigs, selectedConfigTypes }) {
  const [loadedFile, setLoadedFile] = useState(null);
  const [ok, setok] = useState(false);

  function getLoadedConfig(configType) {
    let foundConfig = {};
    if (selectedConfigTypes) {
      foundConfig = selectedConfigTypes.find(function(element) {
        return element.type === configType;
      });
    }
    let isSelected = foundConfig && foundConfig.selected ? foundConfig.selected : false;
    let configs = foundConfig && foundConfig.configs ? foundConfig.configs : [];
    return {
      isSelected: isSelected,
      configs: configs
    };
  }

  function checkSelectedForImport(selectedConfigTypes) {
    let okToImport = false;
    if (selectedConfigTypes) {
      selectedConfigTypes.forEach(configType => {
        if (!okToImport && configType.selected) okToImport = true;
      });
      setok(okToImport);
    }
    return okToImport;
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
      checkSelectedForImport(updateSelected);
      return updateSelected;
    }
  }

  useEffect(
    // allow only saving when config metadata has been uploaded
    () => {
      setCanSaveItem(!!ok);

      if (file && loadedFile !== file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onloadend = function() {
          let allConfigs = JSON.parse(reader.result);
          setLoadedFile(file);
          // reset selected configs
          let updatedConfigs = [];
          MIGRATION_CONFIGS.forEach((config, index) => {
            updatedConfigs[index] = { ...config, selected: false, configs: [] };
          });
          // Update selected configs with loaded config file data
          Object.keys(allConfigs).forEach(configType => {
            let foundIndex = updatedConfigs.findIndex(function(element) {
              return element.type === configType;
            });
            let defaultConfig = MIGRATION_CONFIGS[foundIndex];
            if (foundIndex != -1)
              updatedConfigs[foundIndex] = { ...defaultConfig, selected: true, configs: allConfigs[configType] };
          });
          checkSelectedForImport(updatedConfigs);
          callBackSelectedConfigs(updatedConfigs);
        };
      }
    },
    [file, setCanSaveItem, loadedFile, callBackSelectedConfigs]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configImport')} />
      <SubViewHeader>{t('in-settings:tabs.configImport')}</SubViewHeader>
      <SectionLine />
      <h2>{t('in-settings:tabs.uploadTheConfigurationData')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configImportHelp" />
      </p>

      <form method="post" encType="multipart/form-data">
        <Section restrictWidth="50rem">
          <div className={locals.flexWrapper}>
            <Button
              kind="secondary"
              icon="lib_views_file"
              onClick={() => {
                input.type = 'file';
                input.accept = 'text/json';
                input.click();
              }}
            >
              {file ? shorten(file.name, 32) : t('in-settings:tabs.chooseFile')}
            </Button>
          </div>
        </Section>
      </form>
      {selectedConfigTypes ? (
        selectedConfigTypes.map(configType => (
          <AccordionConfigs
            key={configType.type}
            label={configType.label}
            icon={configType.icon}
            configs={getLoadedConfig(configType.type).configs}
            configType={configType.type}
            checked={getLoadedConfig(configType.type).isSelected}
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
    </>
  );
}
