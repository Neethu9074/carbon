/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { Ul, Li, KeyValue } from '@instana/components';
import { Button } from '@instana/components';

import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import { MIGRATION_CONFIGS } from '../../components/MigrationTypes';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import SectionLine from 'in-settings/components/SectionLine';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import SearchInput from 'in-components/SearchInput';
import { shorten } from 'in-services/util/string';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [loadedConfigs, setLoadedConfigs] = useState([]);
  const [loadedFile, setLoadedFile] = useState(null);

  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  function setImportConfigs(form, loadedConfigs) {
    let cleanedConfigs = {};
    loadedConfigs.forEach(loadedConfig => {
      if (form.get(loadedConfig.type).value) {
        let configsToImport = [];
        loadedConfig.configs.forEach(config => {
          if (loadedConfig.selected.includes(config.id)) configsToImport.push(config);
        });
        cleanedConfigs[loadedConfig.type] = configsToImport;
      }
    });
    return cleanedConfigs;
  }

  useEffect(() => {
    // initialise loaded configs
    if (file && loadedFile !== file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onloadend = function() {
        setLoadedFile(file);
        let allConfigs = JSON.parse(reader.result);
        let loadedConfigs = [];
        let configIds = Object.keys(allConfigs);

        Object.values(allConfigs).forEach((children, index) => {
          let configDetail = MIGRATION_CONFIGS.find(function(element) {
            return element.type === configIds[index];
          });
          let defaultAllSelected = [];
          children.forEach(child => {
            defaultAllSelected.push(child.id);
          });
          loadedConfigs.push({
            ...configDetail,
            configs: children,
            selected: defaultAllSelected,
            filtered: defaultAllSelected,
            shadowSelected: defaultAllSelected
          });
        });
        setLoadedConfigs(loadedConfigs);
      };
    }
  }, [file, loadedFile]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
        }}
        saveLabel={t('in-settings:tabs.migrationImport')}
        enrichForm={enrichForm}
        render={render}
        saveItem={({ form, setMessage, loadedConfigs }) => {
          setMessage({
            message: t('in-settings:tabs.importingConfig'),
            type: 'neutral',
            isSaving: true
          });
          let importConfigs = setImportConfigs(form, loadedConfigs);
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
        }}
        loadedConfigs={loadedConfigs}
        callBackUpdateSelectedConfigs={(configType, selectedConfigs) => {
          let updatedLoadedConfigs = [];
          loadedConfigs.forEach(config => {
            if (config.type === configType) {
              updatedLoadedConfigs.push({ ...config, selected: selectedConfigs, shadowSelected: selectedConfigs });
            } else updatedLoadedConfigs.push(config);
          });
          setLoadedConfigs(updatedLoadedConfigs);
        }}
        callBackUpdateFilteredConfigs={(filtered, configType) => {
          let updatedLoadedConfigs = [];
          let updatedSelectedConfigs = [];
          loadedConfigs.forEach(config => {
            if (config.type === configType) {
              if (filtered && filtered.length > 0) {
                filtered.forEach(id => {
                  if (config.shadowSelected.includes(id)) updatedSelectedConfigs.push(id);
                });
                updatedLoadedConfigs.push({ ...config, filtered: filtered, selected: updatedSelectedConfigs });
              } else {
                let filteredIds = [];
                // reset filter to show all and previously selected
                config.configs.forEach(child => {
                  filteredIds.push(child.id);
                });
                updatedLoadedConfigs.push({ ...config, filtered: filteredIds, selected: config.shadowSelected });
              }
            } else updatedLoadedConfigs.push(config);
          });
          setLoadedConfigs(updatedLoadedConfigs);
        }}
      />
    </>
  );
}

function getSelectedConfigIds(selectedConfigs) {
  let selectedIds = [];
  if (selectedConfigs) {
    let configIds = Object.keys(selectedConfigs);
    Object.values(selectedConfigs).forEach((config, index) => {
      if (config.value) selectedIds.push(configIds[index]);
    });
  }
  return selectedIds;
}

function filterConfigs(filter, loadedConfigs) {
  let filteredIds = [];
  if (filter) {
    Object.values(loadedConfigs).forEach(config => {
      let lcFilter = filter.toLowerCase();
      if (
        config.label?.toLowerCase().includes(lcFilter) ||
        config.name?.toLowerCase().includes(lcFilter) ||
        config.alertName?.toLowerCase().includes(lcFilter)
      )
        filteredIds.push(config.id);
    });
  }
  return filteredIds;
}

function findConfigById(findId, configs) {
  let found = {};
  if (configs && findId && Object.keys(found).length === 0) {
    Object.values(configs).forEach(config => {
      if (config.id === findId) found = config;
    });
  }
  return found;
}

function getConfigList(
  loadedConfigs,
  form,
  setForm,
  setCanSaveItem,
  callBackUpdateSelectedConfigs,
  callBackUpdateFilteredConfigs
) {
  return (
    <Ul>
      {loadedConfigs.map(config =>
        form.get(config.type).map(field => {
          return (
            <Li
              key={config.type}
              open
              toggleContentOnRowClick
              renderNestedContent={() => (
                <>
                  <div className={locals.searchInput}>
                    <SearchInput
                      onChange={queryFilter => {
                        let filtered = filterConfigs(queryFilter, config.configs);
                        callBackUpdateFilteredConfigs(filtered, config.type);
                      }}
                    />
                  </div>
                  <Ul>
                    {config.filtered.map(filteredId => {
                      let child = findConfigById(filteredId, config.configs);
                      return (
                        <Li key={child.id}>
                          <CheckboxFancy
                            key={child.id}
                            id={child.id}
                            label={
                              <KeyValue
                                className={locals.keyValueEllipsis}
                                label={
                                  child.label
                                    ? child.label
                                    : child.name
                                    ? child.name
                                    : child.alertName
                                    ? child.alertName
                                    : child.id
                                }
                                value={child.description ? child.description : child.kind ? child.kind : ''}
                              />
                            }
                            size="larger"
                            checked={config.selected.includes(child.id)}
                            onChange={e => {
                              let configsSelected = config.selected.slice();
                              let childExistIndex = configsSelected.indexOf(child.id);
                              // remove item if found and not selected
                              if (childExistIndex > -1 && !e.target.checked) {
                                configsSelected.splice(childExistIndex, 1);
                              } else configsSelected.push(child.id);
                              callBackUpdateSelectedConfigs(config.type, configsSelected);
                              setForm(
                                form.updateIn([config.type], f =>
                                  f.setValue(configsSelected.length > 0).setTouched(true)
                                )
                              );
                            }}
                          />
                        </Li>
                      );
                    })}
                  </Ul>
                </>
              )}
            >
              <CheckboxFancy
                key={config.type}
                id={config.type}
                label={
                  <IconLabel
                    type={config.icon}
                    text={
                      config.label +
                      ' (displaying ' +
                      config.filtered.length +
                      ' of ' +
                      config.configs.length +
                      ', selected: ' +
                      config.selected.length +
                      ')'
                    }
                    noBottomMargin
                  />
                }
                checked={field.value}
                onChange={e => {
                  setForm(form.updateIn([config.type], f => f.setValue(e.target.checked).setTouched(true)));
                  if (e.target.checked) {
                    setCanSaveItem(e.target.checked);
                    let defaultAllSelected = [];
                    config.configs.forEach(config => defaultAllSelected.push(config.id));
                    callBackUpdateSelectedConfigs(config.type, defaultAllSelected);
                  } else {
                    // need to check that at least one other configuration type is selected to enable Save button
                    let selectedIds = getSelectedConfigIds(form.items);
                    if (selectedIds.length > 1 || (selectedIds.length === 1 && !selectedIds.includes(config.type)))
                      setCanSaveItem(true);
                    else setCanSaveItem(false);
                    // clear all child selected configs
                    callBackUpdateSelectedConfigs(config.type, []);
                  }
                }}
                size="larger"
              />
            </Li>
          );
        })
      )}
    </Ul>
  );
}

function render({
  form,
  setForm,
  setCanSaveItem,
  input,
  file,
  loadedConfigs,
  callBackUpdateSelectedConfigs,
  callBackUpdateFilteredConfigs
}) {
  if (file && form.get('firstLoad').value) {
    setCanSaveItem(true);
    setForm(form.updateIn(['firstLoad'], f => f.setValue(false)));
  }

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
        <Section>
          <FormGroup>
            {file && loadedConfigs ? (
              getConfigList(
                loadedConfigs,
                form,
                setForm,
                setCanSaveItem,
                callBackUpdateSelectedConfigs,
                callBackUpdateFilteredConfigs
              )
            ) : (
              <div />
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
