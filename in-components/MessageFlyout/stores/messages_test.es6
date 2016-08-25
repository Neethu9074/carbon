/* eslint-env mocha */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import React from 'react';

import {resetStoreRegistry} from 'in-stores/store';

describe('in-components/MessageFlyout/stores/messages', () => {
  let mod;

  beforeEach(() => {
    resetStoreRegistry();
    mod = proxyquire('in-components/MessageFlyout/stores/messages', {});
  });

  it('must start without any messages', () => {
    withLatestMessages(messages => {
      expect(messages.length).to.equal(0);
    });
  });

  it('must add messages without IDs', () => {
    const id = mod.addMessage('warning', <div />);
    withLatestMessages(messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added without IDs', () => {
    const id = mod.addMessage('warning', <div />);
    mod.addMessage('error', <div />, id);
    withLatestMessages(messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal(id);
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must add messages with IDs', () => {
    const id = mod.addMessage('warning', <div />, 'foo');
    expect(id).to.equal('foo');
    withLatestMessages(messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('warning');
    });
  });

  it('must update messages that were added with IDs', () => {
    mod.addMessage('warning', <div />, 'foo');
    mod.addMessage('error', <div />, 'foo');
    withLatestMessages(messages => {
      expect(messages.length).to.equal(1);
      expect(messages[0].id).to.equal('foo');
      expect(messages[0].type).to.equal('error');
    });
  });

  it('must not remove existing messages when updating', () => {
    mod.addMessage('info', <div />, 1);
    mod.addMessage('error', <div />, 2);
    mod.addMessage('info', <div />, 3);

    mod.addMessage('warning', <div />, 2);

    withLatestMessages(messages => {
      expect(messages.length).to.equal(3);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(2);
      expect(messages[1].type).to.equal('warning');
      expect(messages[2].id).to.equal(3);
    });
  });

  it('must remove messages', () => {
    mod.addMessage('info', <div />, 1);
    mod.addMessage('error', <div />, 2);
    mod.addMessage('info', <div />, 3);

    mod.removeMessage(2);

    withLatestMessages(messages => {
      expect(messages.length).to.equal(2);
      expect(messages[0].id).to.equal(1);
      expect(messages[1].id).to.equal(3);
    });
  });

  function withLatestMessages(fn) {
    let _messages;
    // hack to clean up stacktraces and correct error reporting
    mod.messages$.once(messages => _messages = messages);
    fn(_messages);
  }
});
