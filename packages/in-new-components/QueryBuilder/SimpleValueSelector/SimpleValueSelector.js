import AutosizeInput from 'react-input-autosize';
import React from 'react';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { evaluateClassNames } from 'in-services/util/classnames';
import { Ul, Li } from 'in-new-components/lists/List/List';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { number } from 'in-services/formatters/number';
import { isLoading } from 'in-services/util/result';
import Typeahead from 'in-new-components/Typeahead';
import useObservable from 'in-hooks/useObservable';
import { shorten } from 'in-services/util/string';

import styleDefs from './SimpleValueSelector.mless';

export default function SimpleValueSelector({
  onChange,
  value,
  close,
  getSuggestions,
  fieldsToWatch,
  inputProps = {}
}) {
  const locals = useThemedLocals(styleDefs);

  return (
    <Typeahead
      render={render}
      resultsToShow={42}
      value={value}
      onChange={e => onChange(e.value.trim())}
      close={close}
      inputProps={{ ...inputProps, locals }}
      getSuggestions={getSuggestions}
      fieldsToWatch={fieldsToWatch}
      locals={locals}
    />
  );
}

function render({ inputProps, getInputProps, isOpen, openMenu, ...remainingProps }) {
  const { locals, valid, ...remainingInputProps } = inputProps;

  return (
    <>
      <AutosizeInput
        minWidth={32}
        inputClassName={evaluateClassNames({
          [locals.input]: true,
          [locals.invalid]: !valid
        })}
        {...remainingInputProps}
        {...getInputProps({ onFocus: openMenu })}
      />
      {isOpen && <SuggestionsList {...remainingProps} />}
    </>
  );
}
function SuggestionsList({
  lowerCaseInputValue,
  inputValue,
  getMenuProps,
  getSuggestions,
  getItemProps,
  highlightedIndex,
  close,
  fieldsToWatch,
  locals
}) {
  const suggestionsResult = useObservable(getSuggestions, fieldsToWatch);

  if (isLoading(suggestionsResult)) {
    return <LoadingList className={locals.list} skeletonClassName={locals.skeleton} size="compact" />;
  }

  const suggestions = suggestionsResult?.data?.suggestions ?? [];
  const totalHits = suggestionsResult?.data?.totalHits ?? 0;

  const filteredOptions = suggestions.filter(item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue));
  if (filteredOptions.length === 0) {
    return null;
  }

  const menuProps = getMenuProps();

  return (
    <Ul
      className={locals.list}
      aria-labelledby={menuProps['aria-labelledby']}
      id={menuProps.id}
      role={menuProps.role}
      refSetter={menuProps.ref}
    >
      {filteredOptions.map((item, index) => {
        const itemProps = getItemProps({
          index,
          item
        });

        return (
          <OverlayOption
            key={index}
            className={evaluateClassNames({
              [locals.option]: true,
              [locals.highlighted]: highlightedIndex === index
            })}
            {...itemProps}
            onChange={itemProps.onClick}
            close={close}
            value={item}
          >
            {shorten(item, 190)}
          </OverlayOption>
        );
      })}
      {totalHits > suggestions.length && (
        <Li className={locals.moreOptionsLabel} size="compact">
          {number.compact(totalHits - suggestions.length)} More
        </Li>
      )}
    </Ul>
  );
}
