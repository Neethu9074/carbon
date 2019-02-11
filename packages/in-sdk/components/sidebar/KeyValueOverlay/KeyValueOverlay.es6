import { compose, withState } from 'recompose';
import React from 'react';

import KeyValueDialogPresenter from 'in-sdk/components/sidebar/KeyValueOverlay/KeyValueDialogPresenter';
import Separator from 'in-sdk/components/sidebar/Separator';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './KeyValueOverlay.mless';

export default compose(
  withState('query', 'setQuery', '')(function KeyValueOverlay(props) {
    const data = props.data;
    if (data == null || data.size === 0) {
      return null;
    }

    return (
      <Overlay props={props} content={KeyValueDialogWrapper} withoutWrapper withoutArrow>
        {KeyValueButtonWrapper}
      </Overlay>
    );
  })
);

function KeyValueButtonWrapper(props) {
  const { header, toggle, isOpen, refSetter } = props;

  return (
    <div className={locals.wrapper}>
      <Separator />
      <div className={locals.item}>
        <div className={locals.header}>{header}</div>
        <div className={isOpen ? locals.buttonOpen : locals.button} onClick={toggle}>
          <SvgIcon
            className={locals.icon}
            type="popup"
            width={16}
            color="#4a91e4"
            expanded={isOpen}
            refSetter={refSetter}
          />
        </div>
      </div>
    </div>
  );
}

function KeyValueDialogWrapper({ header, data, query, setQuery }) {
  let items = data.map((v, k) => ({
    value: v,
    key: k
  }));

  return (
    <KeyValueDialogPresenter header={header} items={items} onChange={onChange} query={query} onQueryChange={setQuery} />
  );

  function onChange() {
    close();
  }
}
