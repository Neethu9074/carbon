/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import React from 'react';

import {
  addMessage,
  removeMessage,
  messages$,
  MessageWithId
} from 'in-components/MessageFlyout/stores/messages';

describe('in-components/MessageFlyout/stores/messages', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('must start without any messages', done => {
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(0);
    });
  });

  it('must add messages without IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> });
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added without IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> });
    addMessage({ type: 'error', content: <div /> }, id);
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must add messages with IDs', done => {
    const id = addMessage({ type: 'warning', content: <div /> }, 'foo');
    expect(id).to.equal('foo');
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added with IDs', done => {
    addMessage({ type: 'warning', content: <div /> }, 'foo');
    addMessage({ type: 'error', content: <div /> }, 'foo');
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must not remove existing messages when updating', done => {
    addMessage({ type: 'info', content: <div /> }, 1);
    addMessage({ type: 'error', content: <div /> }, 2);
    addMessage({ type: 'info', content: <div /> }, 3);

    addMessage({ type: 'warning', content: <div /> }, 2);

    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(3);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(2);
      expect(messages[1].type).to.equal('warning');
      expect(messages[2].id).to.equal(3);
    });
  });

  it('must remove messages', done => {
    addMessage({ type: 'info', content: <div /> }, 1);
    addMessage({ type: 'error', content: <div /> }, 2);
    addMessage({ type: 'info', content: <div /> }, 3);

    removeMessage(2);

    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(2);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(3);
    });
  });

  function withLatestMessages(done: () => void, fn: (messages: MessageWithId[]) => void) {
    messages$.once(messages => {
      fn(messages);
      done();
    });
  }
});
