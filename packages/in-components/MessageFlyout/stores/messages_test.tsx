/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import * as React from 'react';

import {
  addMessage,
  removeMessage,
  messages$,
  MessageWithId,
  removeAllMessages
} from 'in-components/MessageFlyout/stores/messages';

describe('in-components/MessageFlyout/stores/messages', () => {
  beforeEach(removeAllMessages);

  it('must start without any messages', done => {
    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(0);
    });
  });

  it('must add messages without IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> });
    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(1);
      expect(messages[0].id).toEqual(id);
      expect(messages[0].type).toEqual('warning');
    });
  });

  it('must update messages that were added without IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> });
    addMessage({ type: 'danger', content: <div /> }, id);
    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(1);
      expect(messages[0].id).toEqual(id);
      expect(messages[0].type).toEqual('danger');
    });
  });

  it('must add messages with IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> }, 'foo');
    expect(id).toEqual('foo');
    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(1);
      expect(messages[0].id).toEqual('foo');
      expect(messages[0].type).toEqual('warning');
    });
  });

  it('must update messages that were added with IDs', done => {
    addMessage({ type: 'warning', content: <div /> }, 'foo');
    addMessage({ type: 'danger', content: <div /> }, 'foo');
    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(1);
      expect(messages[0].id).toEqual('foo');
      expect(messages[0].type).toEqual('danger');
    });
  });

  it('must not remove existing messages when updating', done => {
    addMessage({ type: 'info', content: <div /> }, 1);
    addMessage({ type: 'danger', content: <div /> }, 2);
    addMessage({ type: 'info', content: <div /> }, 3);

    addMessage({ type: 'warning', content: <div /> }, 2);

    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(3);
      expect(messages[0].id).toEqual(1);
      expect(messages[1].id).toEqual(2);
      expect(messages[1].type).toEqual('warning');
      expect(messages[2].id).toEqual(3);
    });
  });

  it('must remove messages', done => {
    addMessage({ type: 'info', content: <div /> }, 1);
    addMessage({ type: 'danger', content: <div /> }, 2);
    addMessage({ type: 'info', content: <div /> }, 3);

    removeMessage(2);

    withLatestMessages(done, messages => {
      expect(messages.length).toEqual(2);
      expect(messages[0].id).toEqual(1);
      expect(messages[1].id).toEqual(3);
    });
  });

  function withLatestMessages(done: () => void, fn: (messages: MessageWithId[]) => void) {
    messages$.once(messages => {
      fn(messages);
      done();
    });
  }
});
