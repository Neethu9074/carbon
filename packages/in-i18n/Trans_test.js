/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

// eslint-disable-next-line no-restricted-imports
import { Trans as InternalTrans } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';
import { mount } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import Trans, { markAsSecureString } from 'in-i18n/Trans';
import { getProps } from 'in-test/enzymeTestUtils';

describe('in-i18n/Trans', () => {
  it('must work with primitive', () => {
    const date = new Date();
    const wrapper = mount(
      <Trans i18n={i18n} i18nKey="help" defaults="A test!" values={{ num: 1, bool: true, date }} />
    );
    expect(getValues(wrapper)).to.deep.equal({
      num: 1,
      bool: true,
      date
    });
  });

  it('must work without values', () => {
    const wrapper = mount(<Trans i18n={i18n} i18nKey="help" defaults="A test!" />);
    expect(getValues(wrapper)).to.deep.equal(undefined);
  });

  it('must support strings via markAsSecureString', () => {
    const wrapper = mount(
      <Trans
        i18n={i18n}
        i18nKey="help"
        defaults="A test!"
        values={{
          name: markAsSecureString('Mark Hamil'),
          age: 42
        }}
      />
    );
    expect(getValues(wrapper)).to.deep.equal({
      name: 'Mark Hamil',
      age: 42
    });
  });

  it('must escape non-secure strings', async () => {
    const wrapper = await mount(
      <Trans
        i18n={i18n}
        i18nKey="help"
        defaults="A test!"
        values={{
          name: 'You want some <strong>security</strong>, right?! <script>alert("pwnd");</script> or whaaattt?',
          age: 42
        }}
      />
    );
    expect(getValues(wrapper)).to.deep.equal({
      name: 'You want some &lt;strong&gt;security&lt;/strong&gt;, right?!  or whaaattt?',
      age: 42
    });
  });

  function getValues(wrapper) {
    return getProps(wrapper, { componentType: InternalTrans }).values;
  }
});
