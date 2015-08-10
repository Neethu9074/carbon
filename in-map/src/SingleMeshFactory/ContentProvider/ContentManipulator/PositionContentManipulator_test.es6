/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';

import PCM from './PositionContentManipulator';


describe('3D map', () => {
  const contentProvider = {
    getVertices() { return [4, 5, 6]; }
  };

  describe('PositionContentManipulator', () => {
    it('can steam vertices', () => {
      const positionContentManipulator = new PCM({contentProvider});
      const vertices = positionContentManipulator.getVertices();

      expect(vertices[0]).to.equal(4);
      expect(vertices[1]).to.equal(5);
      expect(vertices[2]).to.equal(6);
    });

    it('can manipulate steamed vertices', () => {
      const positionContentManipulator = new PCM({
        contentProvider,
        x: 0.5,
        y: 2,
        z: -10.5
      });

      const vertices = positionContentManipulator.getVertices();

      expect(vertices[0]).to.equal(4.5);
      expect(vertices[1]).to.equal(7);
      expect(vertices[2]).to.equal(-4.5);
    });
  });
});
