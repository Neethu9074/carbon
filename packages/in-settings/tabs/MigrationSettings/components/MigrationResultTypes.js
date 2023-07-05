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

function configReportSummary(configType) {
  const reportSummary = {
    created: [],
    updated: [],
    skipped: [],
    error: [],
    na: []
  };

  configType.configs?.map(config => {
    const { result, id } = config;
    if (result) {
      const normalizedResult = result.toLowerCase();
      switch (normalizedResult) {
        case 'created':
          reportSummary.created.push(id);
          break;
        case 'updated':
          reportSummary.updated.push(id);
          break;
        case 'skipped':
          reportSummary.skipped.push(id);
          break;
        case 'error':
          reportSummary.error.push(id);
          break;
      }
    } else {
      reportSummary.na.push(id);
    }
  });

  return reportSummary;
}

// returns a summary of result type counts from config data
export function getConfigReportSummary(allConfigData) {
  let reportSummary = {};

  if (allConfigData) {
    const configTypes = Object.values(allConfigData);
    configTypes
      .filter(configType => configType !== null && configType.key)
      .forEach(configType => (reportSummary[configType.key] = configReportSummary(configType)));
  }
  return reportSummary;
}
