/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MigrationResultIconLabel from './MigrationResultIconLabel';

export const RESULT_TYPES = [
  { value: 'created', label: 'Created New', icon: 'lib_check', color: 'green' },
  { value: 'updated', label: 'Updated Existing', icon: 'lib_actions_revert', color: 'green' },
  { value: 'skipped', label: 'Skipped - Already Exists', icon: 'lib_help_error_error_outline', color: 'blue' },
  { value: 'error', label: 'Error!', icon: 'lib_openclose_cancel', color: 'red' },
  { value: 'na', label: 'Not Imported', icon: '', color: 'black' }
];

// displays appropriate result icon
export function getResultIconLabel(result, label, size) {
  let foundResult;
  if (result) {
    RESULT_TYPES.forEach(type => {
      if (!foundResult && type.value === result.toLowerCase()) {
        foundResult = type;
      }
    });
    return (
      <MigrationResultIconLabel
        key={foundResult.value}
        type={foundResult.icon}
        text={label}
        noBottomMargin
        color={foundResult.color}
        toolTip={foundResult.label}
        size={size ? size : 'regular'}
      />
    );
  }
  return label;
}

// returns a summary of result type counts from config data
export function getConfigReportSummary(allConfigData) {
  let reportSummary = {};
  if (allConfigData) {
    Object.values(allConfigData).map(configType => {
      if (configType !== null) {
        let resultCreatedIds = [];
        let resultUpdatedIds = [];
        let resultSkippedIds = [];
        let resultErrorIds = [];
        let noResultIds = [];
        configType.configs.map(config => {
          if (config.result) {
            switch (config.result.toLowerCase()) {
              case 'created':
                resultCreatedIds.push(config.id);
                break;
              case 'updated':
                resultUpdatedIds.push(config.id);
                break;
              case 'skipped':
                resultSkippedIds.push(config.id);
                break;
              case 'error':
                resultErrorIds.push(config.id);
                break;
            }
          } else {
            noResultIds.push(config.id);
          }
        });
        let configReportSummary = {
          created: resultCreatedIds,
          updated: resultUpdatedIds,
          skipped: resultSkippedIds,
          error: resultErrorIds,
          na: noResultIds
        };
        reportSummary[configType.key] = configReportSummary;
      }
    });
  }
  return reportSummary;
}
