/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Rule from 'in-applications/Forms/components/Rule';

export default function ServiceExtractionRule({
  serviceConfig,
  reorderable,
  onToggleEnable,
  isInstanaDefaultRule = false,
  onEdit,
  onRemove,
  preview,
  editDisabled
}) {
  return (
    <Rule
      name={serviceConfig.name}
      content={preview}
      enabled={serviceConfig.enabled}
      reorderable={reorderable}
      isInstanaDefaultRule={isInstanaDefaultRule}
      onToggleEnable={onToggleEnable}
      onEdit={() => onEdit(serviceConfig)}
      onRemove={() => onRemove(serviceConfig)}
      editDisabled={editDisabled}
    />
  );
}
