/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import PositionComponent from './PositionComponent';


describe('3D map', () => {
  let component;
  let sceneObject;
  let positionChanged;

  beforeEach(() => {
    positionChanged = sinon.stub();
    sceneObject = {
      eventEmitter: new RoEmitter(),
      positionChanged: sinon.stub(),
      scene: {renderScene: sinon.stub()}
    };
    sceneObject.eventEmitter.on('positionChanged').subscribe(positionChanged);
    component = new PositionComponent({sceneObject});
  });

  describe('PositionComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
    });

    it('dont call external method until time event was handled', () => {
      component.setPosition(1, 2, 3);
      expect(positionChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(positionChanged.callCount).to.equal(1);

      const pos = component.getPosition();
      expect(pos.x).to.equal(1);
      expect(pos.y).to.equal(2);
      expect(pos.z).to.equal(3);
    });

    it('should do nothing if there is no change', () => {
      component.setPosition(1, 2, 3);
      expect(positionChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(positionChanged.callCount).to.equal(1);

      component.setPosition(1, 2, 3);
      expect(positionChanged.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(positionChanged.callCount).to.equal(1);
    });

  });
});
