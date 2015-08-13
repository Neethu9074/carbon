/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';

import SMF from './SingleMeshFactory';


describe('3D map', () => {
  const contentProvider = {
    getVertices() { return [4, 5, 6]; },
    getColors() { return [7, 8, 9]; }
  };
  let factory;

  beforeEach(() => {
    global.__DEV__ = true;
    factory = new SMF({
      scene: {
        addSceneObject() {},
        removeSceneObject() {}
      }
    });
  });

  describe('SingleMeshFactory', () => {

    it('can add a fragment', () => {
      factory.addFragment({id: 123, contentProvider});

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(123).id).to.equal(123);
    });

    it('can update an existing fragment', () => {
      factory.addFragment({id: 123, contentProvider});
      expect(factory.fragments.length).to.equal(1);
      expect(factory.fragments[0].colors[0]).to.equal(7);
      expect(factory.fragments[0].colors[1]).to.equal(8);
      expect(factory.fragments[0].colors[2]).to.equal(9);

      factory.addFragment({id: 123, contentProvider: {
        getVertices() { return [6, 5, 4]; },
        getColors() { return [9, 8, 7]; }
      }});
      expect(factory.fragments.length).to.equal(1);
      expect(factory.fragments[0].colors[0]).to.equal(9);
      expect(factory.fragments[0].colors[1]).to.equal(8);
      expect(factory.fragments[0].colors[2]).to.equal(7);
    });

    it('can remove an existing fragment', () => {
      factory.addFragment({id: 123, contentProvider});
      expect(factory.fragments.length).to.equal(1);

      factory.removeFragment(123);
      expect(factory.fragments.length).to.equal(0);
    });

    it('can build the geometry', () => {
      factory.addFragment({id: 1, contentProvider: {
        getVertices() { return [1, 2, 3]; },
        getColors() { return [7, 8, 9]; }
      }});
      factory.addFragment({id: 2, contentProvider: {
        getVertices() { return [4, 5, 6]; },
        getColors() { return [10, 11, 12]; }
      }});

      factory.rebuild();

      expect(factory.geometry.attributes.position.array.length).to.equal(6);
      expect(factory.geometry.attributes.color.array.length).to.equal(6);

      factory.removeFragment(1);
      expect(factory.geometry.attributes.position.array.length).to.equal(3);
      expect(factory.geometry.attributes.color.array.length).to.equal(3);
    });

    it('can be disposed', () => {
      factory.dispose();
      expect(factory.fragments).to.equal(null);
    });
  });
});
