/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isNull } from 'lodash';

import { EntityId } from '@instana/types';

import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';

export type QualifiedRCAEntityTypes = 'infrastructure' | 'application' | 'service' | 'endpoint' | 'process' | 'unknown';

const determineEntityTypeFromEntityIDMap = (entityID: EntityId): QualifiedRCAEntityTypes => {
  const { pluginId } = entityID;
  if (pluginId === 'application' || pluginId === 'service') return pluginId;
  const pluginName = translateFullyQualifiedPluginToShortPluginName(pluginId);
  if (!isNull(pluginName) && ['application', 'service', 'endpoint', 'process'].includes(pluginName))
    return pluginName as QualifiedRCAEntityTypes;
  return 'infrastructure';
};

export default determineEntityTypeFromEntityIDMap;
