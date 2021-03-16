/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import infrastructure from 'in-internal/monitoringUnit/units/UnitList/analysisModes/infrastructure';
import application from 'in-internal/monitoringUnit/units/UnitList/analysisModes/application';
import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import profile from 'in-internal/monitoringUnit/units/UnitList/analysisModes/profile';
import stan from 'in-internal/monitoringUnit/units/UnitList/analysisModes/stan';
import api from 'in-internal/monitoringUnit/units/UnitList/analysisModes/api';
import eum from 'in-internal/monitoringUnit/units/UnitList/analysisModes/eum';

export const analysisTypes = {
  '': {
    name: 'Nothing',
    cols: [unitColumn]
  },
  api,
  application,
  profile,
  eum,
  infrastructure,
  stan
};
