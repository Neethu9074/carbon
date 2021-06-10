/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import React from 'react';

import { SvgIcon } from '@instana/components';

import KeyValueDialogPresenter from 'in-sdk/components/sidebar/KeyValueOverlay/KeyValueDialogPresenter';
import Overlay from 'in-components/overlays/Overlay';

import locals from './KeyValueOverlay.mless';

export default compose(withState('query', 'setQuery', ''))(function KeyValueOverlay(props) {
  const data = props.data;
  if (data == null || data.size === 0) {
    return null;
  }

  return (
    <Overlay props={props} content={KeyValueDialogWrapper} withoutWrapper withoutArrow>
      {KeyValueButtonWrapper}
    </Overlay>
  );
});

function KeyValueButtonWrapper(props) {
  const { header, toggle, isOpen, refSetter } = props;

  return (
    <div className={locals.wrapper}>
      <div className={locals.item}>
        <div className={locals.header}>{header}</div>
        <div className={isOpen ? locals.buttonOpen : locals.button} onClick={toggle}>
          <SvgIcon className={locals.icon} type="lib_actions_copy" size="xs" ref={refSetter} />
        </div>
      </div>
    </div>
  );
}

function KeyValueDialogWrapper({ header, data, query, setQuery, sort }) {
  let items = data.map((v, k) => ({
    value: v,
    key: k
  }));

  return <KeyValueDialogPresenter header={header} items={items} sort={sort} query={query} onQueryChange={setQuery} />;
}
