/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { SuggestionsList } from 'in-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import Typeahead from 'in-components/Typeahead';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/SecondKeyValueSelector.mless';

export default function SecondKeyValueSelector(props) {
  const { onChange, valid, ref, autoFocus, value, getSuggestions, fieldsToWatch } = props;

  return (
    <Typeahead
      value={value}
      getSuggestions={getSuggestions}
      fieldsToWatch={fieldsToWatch}
      onChange={e => onChange(e.value.trim())}
      inputProps={{
        valid,
        ref,
        autoFocus,
        maxLength: 512,
        placeholder: 'Key'
      }}
      render={RenderInputField}
      resultsToShow={6}
    />
  );
}

/** There are props injected by the Downshift library, see Typeahead component */
function RenderInputField({ inputProps, getInputProps, isOpen, openMenu, inputValue, onChange, ...remainingProps }) {
  const { valid, autoFocus, hideValidityInformationOnFocus, ...remainingInputProps } = inputProps;

  return (
    <>
      <Tooltip content={inputValue} align="bottomMiddle">
        <div className={locals.inputFillSpace}>
          <Input
            {...inputProps}
            hasError={!valid}
            onChange={event => onChange(event.target.value)}
            value={inputValue}
            className={classNames({
              [locals.input]: true,
              [locals.invalid]: !valid,
              [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus
            })}
            {...remainingInputProps}
            {...getInputProps({ onFocus: openMenu })}
            autoFocus={autoFocus}
          />
        </div>
      </Tooltip>
      {isOpen && <SuggestionsList {...remainingProps} locals={locals} close={() => {}} />}
    </>
  );
}
