/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createEventBus } from 'in-map/services/eventBus';
import { Texture } from 'in-map/3DLibProvider';

createEventBus();

describe('in-map', () => {
  describe('misc/ParticleEmitter/ParticleEmitter', () => {
    let removeSceneObject;
    let ParticleEmitter;
    let particleEmitter;
    let addSceneObject;
    let metricProvider;
    let parent;

    beforeEach(() => {
      parent = {
        removeChild: sinon.stub()
      };
      addSceneObject = sinon.stub();
      removeSceneObject = sinon.stub();
      metricProvider = create();

      ParticleEmitter = proxyquire('in-map/misc/ParticleEmitter/ParticleEmitter', {
        'in-map/services/imageLoader': {
          loadImage: () => new Texture()
        },
        'in-map/stores/sceneStore': {
          addSceneObject,
          removeSceneObject
        },
        'in-stores/metric': {
          getMetricForFocusedMoment: () => metricProvider
        }
      }).default;

      particleEmitter = new ParticleEmitter({
        id: 'particleEmitter',
        parent
      });
    });

    afterEach(() => {
      particleEmitter.dispose();
    });

    it('should add a sceneObject when started', () => {
      expect(addSceneObject).to.have.callCount(0);

      particleEmitter.start();
      expect(addSceneObject).to.have.callCount(1);
      expect(removeSceneObject).to.have.callCount(0);

      particleEmitter.stop();
      expect(addSceneObject).to.have.callCount(1);
      expect(removeSceneObject).to.have.callCount(1);
    });

    it('should set the number of spawning particles per second to calls metric', () => {
      particleEmitter.start();
      metricProvider.emit([123456789, 42]);
      expect(particleEmitter.particlesPerSecond).to.equal(10);
      expect(particleEmitter.secToNextParticle).to.equal(1 / 10);
    });

    it('should not spawn particles if the metric value is 0', () => {
      particleEmitter.start();
      metricProvider.emit([123456789, 0]);
      expect(particleEmitter.particlesPerSecond).to.equal(0);
      expect(particleEmitter.secToNextParticle).to.equal(Number.MAX_VALUE);
    });
  });
});
