import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default function SearchInput({ onChange, query, inputClassName, wrapperClassName }) {
  return (
    <div className={joinClassNames(locals.wrapper, wrapperClassName)}>
      <Input
        className={joinClassNames(locals.searchInput, inputClassName)}
        type="search"
        placeholder=""
        value={query}
        onChange={e => onChange(e.target.value)}
      />
      <SvgIcon className={locals.icon} type="lib_actions_search" width={24} height={24} />
    </div>
  );
}
