/* eslint-env mocha */
import { expect } from 'chai';

import getConnectionColor, {
  ERROR_COLORS
} from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/connectionColors';

describe('in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/connectionColors', () => {
  describe('getConnectionColor', () => {
    it('should the default color if no error rate was specified', () => {
      expect(getConnectionColor(undefined)).to.deep.equal(ERROR_COLORS[0]);
    });

    it('should return a color based on the error rate', () => {
      expect(getConnectionColor(0.0)).to.deep.equal(ERROR_COLORS[0]);
      expect(getConnectionColor(1.0)).to.deep.equal(ERROR_COLORS[ERROR_COLORS.length - 1]);
    });
  });
});
