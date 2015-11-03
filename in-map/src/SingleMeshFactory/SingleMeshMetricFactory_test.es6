/* eslint-env mocha, node */
import {expect} from 'chai';

import SMMF from './SingleMeshMetricFactory';


let id = 0;

function createFragment2() {
  return {
    id: id++,
    contentProvider: { // PCM
      getVertices() { return [0, 0, 0, 1, 1, 1, 2, 2, 2]; },
      getColors() { return [0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1]; },
      contentProvider: { // SCM
        contentProvider: { // SCCM
          getSliceIndices() { return [0, 1, 2]; }
        }
      }
    }
  };
}

function createFragment1() {
  return {
    id: id++,
    contentProvider: { // PCM
      getVertices() { return [0, 0, 0, 1, 1, 1]; },
      getColors() { return [0, 0, 0, 0.5, 0.5, 0.5]; },
      contentProvider: { // SCM
        contentProvider: { // SCCM
          getSliceIndices() { return [0, 1]; }
        }
      }
    }
  };
}


describe('3D map', () => {
  let factory;

  beforeEach(() => {
    global.__DEV__ = true;
    factory = new SMMF({
      scene: {
        addSceneObject() {},
        removeSceneObject() {},
        renderScene() {}
      },
      height: 1
    });
    factory.animation = {
      start() {},
      stop() {}
    };
  });

  describe('SingleMeshMetricFactory', () => {

    it('can add a fragment', () => {
      const fragment = createFragment2();

      factory.addFragment(fragment);

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
      expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

      factory.rebuild();

      const vertices = factory.vertices;
      expect(vertices.length).to.equal(3 * 3);
      expect(vertices[0]).to.equal(0); expect(vertices[1]).to.equal(0); expect(vertices[2]).to.equal(0);
      expect(vertices[3]).to.equal(1); expect(vertices[4]).to.equal(1); expect(vertices[5]).to.equal(1);
      expect(vertices[6]).to.equal(2); expect(vertices[7]).to.equal(2); expect(vertices[8]).to.equal(2);

      const oldHeights = factory.oldHeights;
      expect(oldHeights.length).to.equal(3);
      expect(oldHeights[0]).to.equal(0); expect(oldHeights[1]).to.equal(0); expect(oldHeights[2]).to.equal(0);

      const newHeights = factory.newHeights;
      expect(newHeights.length).to.equal(3);
      expect(newHeights[0]).to.equal(0); expect(newHeights[1]).to.equal(0); expect(newHeights[2]).to.equal(0);
    });

    it('can update added fragments without rebuild step between updates', () => {
      const fragment = createFragment2();
      const vertices = factory.vertices;

      factory.addFragment(fragment);

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
      expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

      expect(vertices.length).to.equal(0);
      expect(factory.oldHeights.length).to.equal(0);
      expect(factory.newHeights.length).to.equal(0);

      //
      // update the fragment without rebuilding the factory
      //
      fragment.contentProvider = { // PCM
        getVertices() { return [6, 6, 6]; },
        getColors() { return [0, 0, 0]; },
        contentProvider: { // SCM
          contentProvider: { // SCCM
            getSliceIndices() { return [0]; }
          }
        }
      };
      factory.addFragment(fragment);

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
      expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

      expect(factory.vertices.length).to.equal(0);
      expect(factory.oldHeights.length).to.equal(0);
      expect(factory.newHeights.length).to.equal(0);

      factory.rebuild();

      expect(vertices.length).to.equal(3);
      expect(vertices[0]).to.equal(6); expect(vertices[1]).to.equal(6); expect(vertices[2]).to.equal(6);

      const oldHeights = factory.oldHeights;
      expect(oldHeights.length).to.equal(1);
      expect(oldHeights[0]).to.equal(0);

      const newHeights = factory.newHeights;
      expect(newHeights.length).to.equal(1);
      expect(newHeights[0]).to.equal(0);
    });

    it('can update added fragments with rebuild step between updates', () => {
      const fragment = createFragment2();

      factory.addFragment(fragment);

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
      expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

      factory.rebuild();

      let vertices = factory.vertices;
      expect(vertices.length).to.equal(3 * 3);
      expect(vertices[0]).to.equal(0); expect(vertices[1]).to.equal(0); expect(vertices[2]).to.equal(0);
      expect(vertices[3]).to.equal(1); expect(vertices[4]).to.equal(1); expect(vertices[5]).to.equal(1);
      expect(vertices[6]).to.equal(2); expect(vertices[7]).to.equal(2); expect(vertices[8]).to.equal(2);

      let oldHeights = factory.oldHeights;
      expect(oldHeights.length).to.equal(3);
      expect(oldHeights[0]).to.equal(0); expect(oldHeights[1]).to.equal(0); expect(oldHeights[2]).to.equal(0);

      let newHeights = factory.newHeights;
      expect(newHeights.length).to.equal(3);
      expect(newHeights[0]).to.equal(0); expect(newHeights[1]).to.equal(0); expect(newHeights[2]).to.equal(0);

      //
      // update the fragment
      //
      fragment.contentProvider = { // PCM
        getVertices() { return [6, 6, 6]; },
        getColors() { return [0, 0, 0]; },
        contentProvider: { // SCM
          contentProvider: { // SCCM
            getSliceIndices() { return [0]; }
          }
        }
      };
      factory.addFragment(fragment);

      expect(factory.fragments.length).to.equal(1);
      expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
      expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

      factory.rebuild();

      vertices = factory.vertices;
      expect(vertices.length).to.equal(3);
      expect(vertices[0]).to.equal(6); expect(vertices[1]).to.equal(6); expect(vertices[2]).to.equal(6);

      oldHeights = factory.oldHeights;
      expect(oldHeights.length).to.equal(1);
      expect(oldHeights[0]).to.equal(0);

      newHeights = factory.newHeights;
      expect(newHeights.length).to.equal(1);
      expect(newHeights[0]).to.equal(0);
    });

    it('can remove fragments', () => {
      const fragment = createFragment2();
      const vertices = factory.vertices;

      factory.addFragment(fragment);

        expect(factory.fragments.length).to.equal(1);
        expect(factory.getFragment(fragment.id)).to.not.equal(void 0);
        expect(factory.getFragment(fragment.id).id).to.equal(fragment.id);

        expect(vertices.length).to.equal(0);
        expect(factory.oldHeights.length).to.equal(0);
        expect(factory.newHeights.length).to.equal(0);

      factory.rebuild();

        expect(vertices.length).to.equal(3 * 3);
        expect(vertices[0]).to.equal(0); expect(vertices[1]).to.equal(0); expect(vertices[2]).to.equal(0);
        expect(vertices[3]).to.equal(1); expect(vertices[4]).to.equal(1); expect(vertices[5]).to.equal(1);
        expect(vertices[6]).to.equal(2); expect(vertices[7]).to.equal(2); expect(vertices[8]).to.equal(2);

        let oldHeights = factory.oldHeights;
        expect(oldHeights.length).to.equal(3);
        expect(oldHeights[0]).to.equal(0); expect(oldHeights[1]).to.equal(0); expect(oldHeights[2]).to.equal(0);

        let newHeights = factory.newHeights;
        expect(newHeights.length).to.equal(3);
        expect(newHeights[0]).to.equal(0); expect(newHeights[1]).to.equal(0); expect(newHeights[2]).to.equal(0);

      factory.removeFragment(fragment.id);

        expect(vertices.length).to.equal(3 * 3);
        expect(vertices[0]).to.equal(0); expect(vertices[1]).to.equal(0); expect(vertices[2]).to.equal(0);
        expect(vertices[3]).to.equal(1); expect(vertices[4]).to.equal(1); expect(vertices[5]).to.equal(1);
        expect(vertices[6]).to.equal(2); expect(vertices[7]).to.equal(2); expect(vertices[8]).to.equal(2);

        oldHeights = factory.oldHeights;
        expect(oldHeights.length).to.equal(3);
        expect(oldHeights[0]).to.equal(0); expect(oldHeights[1]).to.equal(0); expect(oldHeights[2]).to.equal(0);

        newHeights = factory.newHeights;
        expect(newHeights.length).to.equal(3);
        expect(newHeights[0]).to.equal(0); expect(newHeights[1]).to.equal(0); expect(newHeights[2]).to.equal(0);

      factory.rebuild();

        expect(vertices.length).to.equal(0);
        expect(factory.oldHeights.length).to.equal(0);
        expect(factory.newHeights.length).to.equal(0);
    });

    it('can remove fragments without any rebuild step inside', () => {
        const fragment = createFragment2();

      factory.addFragment(fragment);
      factory.removeFragment(fragment.id);

        expect(factory.vertices.length).to.equal(0);
        expect(factory.oldHeights.length).to.equal(0);
        expect(factory.newHeights.length).to.equal(0);

      factory.rebuild();

        expect(factory.vertices.length).to.equal(0);
        expect(factory.oldHeights.length).to.equal(0);
        expect(factory.newHeights.length).to.equal(0);
    });

    it('can set metric values', () => {
        const fragment = createFragment2();
      const factoryFragment = factory.addFragment(fragment);
      factory.rebuild();

      factoryFragment.values = [0.1, 0.5];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(3);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0);
        expect(factory.oldHeights[2]).to.equal(0);

        expect(factory.newHeights.length).to.equal(3);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);

      factoryFragment.values = [0.1, 0.5];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(3);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);

        expect(factory.newHeights.length).to.equal(3);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);

      factoryFragment.values = [2, 3];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(3);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);

        expect(factory.newHeights.length).to.equal(3);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(2);
        expect(factory.newHeights[2]).to.equal(5);
    });

    it('can set metric values for multiple fragments', () => {
        const fragment = createFragment2();
        const fragment2 = createFragment1();
      const factoryFragment = factory.addFragment(fragment);
      const factoryFragment2 = factory.addFragment(fragment2);
      factory.rebuild();

      factoryFragment.values = [0.1, 0.5];
      factoryFragment2.values = [0.4];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0);
        expect(factory.oldHeights[2]).to.equal(0);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(0.4);

      factoryFragment.values = [1, 1];
      factoryFragment2.values = [3];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0.4);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(1);
        expect(factory.newHeights[2]).to.equal(2);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(3);
    });

    it('can swap metrices even if there is no update on values', () => {
        const fragment = createFragment2();
        const fragment2 = createFragment1();
      const factoryFragment = factory.addFragment(fragment);
      const factoryFragment2 = factory.addFragment(fragment2);
      factory.rebuild();

      factoryFragment.values = [0.1, 0.5];
      factoryFragment2.values = [0.4];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0);
        expect(factory.oldHeights[2]).to.equal(0);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(0.4);

      factory.updateHeights();
      factory.updateHeights();
      factory.updateHeights();
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0.4);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(0.4);
    });

    it('can set metric values even if a fragment changes its dimension', () => {
        const fragment = createFragment2();
        const fragment2 = createFragment1();
      const factoryFragment = factory.addFragment(fragment);
      let factoryFragment2 = factory.addFragment(fragment2);
      factory.rebuild();

      factoryFragment.values = [0.1, 0.5];
      factoryFragment2.values = [0.4];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0);
        expect(factory.oldHeights[2]).to.equal(0);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(0.1);
        expect(factory.newHeights[2]).to.equal(0.6);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(0.4);

      factoryFragment.values = [1, 1];
      factoryFragment2.values = [3];
      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(5);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0.4);

        expect(factory.newHeights.length).to.equal(5);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(1);
        expect(factory.newHeights[2]).to.equal(2);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(3);

        const temp = createFragment2();
        temp.id = factoryFragment2.id;
      factoryFragment2 = factory.addFragment(temp);
      factoryFragment2.values = [2, 3];
      factory.rebuild();

        expect(factory.oldHeights.length).to.equal(6);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(0.1);
        expect(factory.oldHeights[2]).to.equal(0.6);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0);
        expect(factory.oldHeights[5]).to.equal(0);

        expect(factory.newHeights.length).to.equal(6);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(1);
        expect(factory.newHeights[2]).to.equal(2);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(0);
        expect(factory.newHeights[5]).to.equal(0);

      factory.updateHeights();

        expect(factory.oldHeights.length).to.equal(6);
        expect(factory.oldHeights[0]).to.equal(0);
        expect(factory.oldHeights[1]).to.equal(1);
        expect(factory.oldHeights[2]).to.equal(2);
        expect(factory.oldHeights[3]).to.equal(0);
        expect(factory.oldHeights[4]).to.equal(0);
        expect(factory.oldHeights[5]).to.equal(0);

        expect(factory.newHeights.length).to.equal(6);
        expect(factory.newHeights[0]).to.equal(0);
        expect(factory.newHeights[1]).to.equal(1);
        expect(factory.newHeights[2]).to.equal(2);
        expect(factory.newHeights[3]).to.equal(0);
        expect(factory.newHeights[4]).to.equal(2);
        expect(factory.newHeights[5]).to.equal(5);
    });

    it('can be disposed', () => {
      factory.dispose();
      expect(factory.fragments).to.equal(null);
    });
  });
});
