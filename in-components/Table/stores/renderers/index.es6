import {
  type as healthColumnType,
  validate as validateHealthColumn,
  initialize as initializeHealthColumn
} from 'in-components/Table/stores/renderers/health';

export const renderers = {
  [healthColumnType]: { validate: validateHealthColumn, initialize: initializeHealthColumn }
};
