/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import React from 'react';

import { resetStoreRegistry } from 'in-stores/store';

describe('in-components/MessageFlyout/stores/messages', () => {
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    mod = proxyquire('in-components/MessageFlyout/stores/messages', {});
  });

  it('must start without any messages', done => {
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(0);
    });
  });

  it('must add messages without IDs', done => {
    const id = mod.addMessage({ type: 'warning', content: <div /> });
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added without IDs', done => {
    const id = mod.addMessage({ type: 'warning', content: <div /> });
    mod.addMessage({ type: 'error', content: <div /> }, id);
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must add messages with IDs', done => {
    const id = mod.addMessage({ type: 'warning', content: <div /> }, 'foo');
    expect(id).to.equal('foo');
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added with IDs', done => {
    mod.addMessage({ type: 'warning', content: <div /> }, 'foo');
    mod.addMessage({ type: 'error', content: <div /> }, 'foo');
    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must not remove existing messages when updating', done => {
    mod.addMessage({ type: 'info', content: <div /> }, 1);
    mod.addMessage({ type: 'error', content: <div /> }, 2);
    mod.addMessage({ type: 'info', content: <div /> }, 3);

    mod.addMessage({ type: 'warning', content: <div /> }, 2);

    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(3);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(2);
      expect(messages[1].type).to.equal('warning');
      expect(messages[2].id).to.equal(3);
    });
  });

  it('must remove messages', done => {
    mod.addMessage({ type: 'info', content: <div /> }, 1);
    mod.addMessage({ type: 'error', content: <div /> }, 2);
    mod.addMessage({ type: 'info', content: <div /> }, 3);

    mod.removeMessage(2);

    withLatestMessages(done, messages => {
      expect(messages.length).to.equal(2);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(3);
    });
  });

  function withLatestMessages(done, fn) {
    mod.messages$.once(messages => {
      fn(messages);
      done();
    });
  }
});
