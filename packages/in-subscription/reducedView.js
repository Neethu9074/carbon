/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-reduced-view',

  transform(observable) {
    return observable.map(translateProps);
  }
});

function translateProps(viewComponent) {
  if (viewComponent.c) {
    viewComponent.children = viewComponent.c.map(translateProps);
  } else {
    viewComponent.children = [];
  }

  if (viewComponent.cl) {
    viewComponent.metadata = { 'container.label': viewComponent.cl };
  }

  if (viewComponent.s) {
    viewComponent.snapshotPreview = viewComponent.s;
    viewComponent.id = viewComponent.s.id;
  }

  viewComponent.healthInfo = viewComponent.h || null;

  return viewComponent;
}
