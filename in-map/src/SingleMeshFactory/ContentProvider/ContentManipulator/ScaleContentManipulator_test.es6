/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';

import SCM from './ScaleContentManipulator';


describe('3D map', () => {
  const contentProvider = {
    getVertices() { return [4, 5, 6]; },
    getColors() { return [7, 8, 9]; }
  };

  describe('ScaleContentManipulator', () => {
    it('can steam vertices', () => {
      const positionContentManipulator = new SCM({contentProvider});
      const vertices = positionContentManipulator.getVertices();

      expect(vertices[0]).to.equal(4);
      expect(vertices[1]).to.equal(5);
      expect(vertices[2]).to.equal(6);
    });

    it('can manipulate steamed vertices', () => {
      const positionContentManipulator = new SCM({
        contentProvider,
        x: 0.5,
        y: 2,
        z: 1
      });

      const vertices = positionContentManipulator.getVertices();

      expect(vertices[0]).to.equal(2); // 4 * 0.5
      expect(vertices[1]).to.equal(10); // 5 * 2
      expect(vertices[2]).to.equal(6); // 6 * 1
    });
  });
});
