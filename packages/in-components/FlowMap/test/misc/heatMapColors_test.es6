/* eslint-env mocha */
import { expect } from 'chai';

import getHeatMapColor, { ERROR_COLORS } from 'in-components/FlowMap/misc/heatMapColors';

describe('in-components/FlowMap/misc/heatMapColors', () => {
  describe('getHeatMapColor', () => {
    it('should the default color if no error rate was specified', () => {
      expect(getHeatMapColor('errors', undefined)).to.deep.equal(ERROR_COLORS[0]);
    });

    it('should return a color based on the error rate', () => {
      expect(getHeatMapColor('errors', 0.0)).to.deep.equal(ERROR_COLORS[0]);
      expect(getHeatMapColor('errors', 1.0)).to.deep.equal(ERROR_COLORS[ERROR_COLORS.length - 1]);
    });
  });
});
