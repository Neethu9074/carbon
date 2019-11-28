import infrastructure from 'in-internal/monitoringUnit/units/UnitList/analysisModes/infrastructure';
import application from 'in-internal/monitoringUnit/units/UnitList/analysisModes/application';
import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
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
  eum,
  infrastructure,
  stan
};
