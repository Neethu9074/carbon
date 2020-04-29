import React from 'react';

import Rule from 'in-applications/Forms/components/Rule';

export default function ServiceExtractionRule({
  serviceConfig,
  reorderable,
  onToggleEnable,
  isInstanaDefaultRule = false,
  onClick,
  preview
}) {
  return (
    <Rule
      name={serviceConfig.name}
      content={preview}
      enabled={serviceConfig.enabled}
      reorderable={reorderable}
      isInstanaDefaultRule={isInstanaDefaultRule}
      onToggleEnable={onToggleEnable}
      onEdit={() => onClick(serviceConfig)}
    />
  );
}
