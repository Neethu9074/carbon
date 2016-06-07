import {combineLatest} from 'reactive-observables';

import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {highlightedEntityIds$} from 'in-stores/highlightedEntityIds';

import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import LCP from 'in-map/src/SingleMeshFactory/ContentProvider/LineContentProvider';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';

import Component from '../Component';
import XYZ from '../XYZ';

export default class BaseHighlightingComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_highlight');

    this.positionToSet = new XYZ(-1000, 0, 0);
    this.scaleToSet = new XYZ(1, 1, 1);

    this.lineContentProvider = new LCP();
    this.fragment = {
      id: this.id,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: this.lineContentProvider
        })
      })
    };
    this.setupHighlightBorderLines();

    this.initialized();
    this.addSubscription('positionChanged', this.positionChanged);
    this.addSubscription('sizeChanged', this.sizeChanged);

    this.highlightingSubscription = combineLatest([highlightedEntityId$, highlightedEntityIds$])
      .subscribe(([highlightedId, highlightedIds]) => {
        const isHighlighted = sceneObject.id === highlightedId || highlightedIds.indexOf(sceneObject.id) !== -1;
        const propertyValue = isHighlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
        sceneObject.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, propertyValue);
      });
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.show();
  }

  onInactiveEnter() {
    this.hide();
  }


  positionChanged(newPosition) {
    this.positionToSet.set(newPosition.x, newPosition.y, newPosition.z);
    this.needsUpdate = true;
  }

  sizeChanged({x, y, z}) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  update() {
    this.setupHighlightBorderLines();

    this.hide();
    if (this.isActive()) {
      this.show();
    }

    this.needsUpdate = false;
  }

  show() {
    this.sceneObject.getFactory('lineSMF').addFragment(this.fragment);
  }

  hide() {
    this.sceneObject.getFactory('lineSMF').removeFragment(this.id);
  }

  dispose() {
    super.dispose();

    this.highlightingSubscription.dispose();
    this.hide();

    this.positionToSet.dispose();
    this.scaleToSet.dispose();

    this.lineContentProvider = null;
    this.positionToSet = null;
    this.scaleToSet = null;
    this.fragment = null;
  }
}
