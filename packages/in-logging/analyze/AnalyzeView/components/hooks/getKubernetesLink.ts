/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { capitalize } from 'in-services/formatters/string';
import { LogItem, LogTag } from 'in-types';

export function getKubernetesLink(tag: LogTag, log: LogItem) {
  const entity = tag.name?.split('.')[1];
  const entityId = log.tags.find(tag => tag.name === `id.kubernetes${capitalize(entity ?? '')}`)?.stringValue;

  if (!entity || !entityId) return null;

  const pathname = `/kubernetes/${entity}/summary`;

  const matrixParameter = {
    path: `/${entity}`,
    name: `${entity}Id`,
    serializer: String,
    parser: String
  };

  return getModifiedUrlStream(location => {
    location.pathname = pathname;
    setOrDeleteMatrixParameter(location, matrixParameter, entityId);
  });
}
