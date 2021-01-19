/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { landingPath } from 'in-integrations/navigation/paths';

export const landingConfigUrlParameter = {
  path: landingPath,
  name: 'config',
  initialState: {},
  parser: buildJsonParser({}),
  serializer: buildJsonSerializer()
};
