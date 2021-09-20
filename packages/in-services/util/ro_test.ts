/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create } from '@instana/observables';

import { combineDataAndError, CombinedDataAndError } from 'in-services/util/ro';

test('combineDataAndError Creation', () => {
  const upstream = create<string>();
  const subscriber = jest.fn<void, [CombinedDataAndError<string>]>();
  const combined = combineDataAndError(upstream);
  combined.subscribe(subscriber);
  upstream.emit('good');
  upstream.emitError('This was an error');
  expect(subscriber.mock.calls[0][0]).toMatchInlineSnapshot(`
    Object {
      "data": "good",
      "error": null,
    }
  `);
  expect(subscriber.mock.calls[1][0]).toMatchInlineSnapshot(`
    Object {
      "data": null,
      "error": "This was an error",
    }
  `);
});

test('combineDataAndError LifeCycle', () => {
  let state = false;
  const upstream = create({
    start() {
      state = true;
    },
    stop() {
      state = false;
    }
  });
  const subscriber = jest.fn();
  const combined = combineDataAndError(upstream);
  expect(state).toBe(false);
  const subscription = combined.subscribe(subscriber);
  expect(state).toBe(true);
  subscription.dispose();
  expect(state).toBe(false);
});
