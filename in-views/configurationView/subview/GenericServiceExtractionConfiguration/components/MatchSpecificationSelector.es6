import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';


function MatchSpecificationItem({matchSpecificationOption, matchSpecificationForm}) {
  if (matchSpecificationOption.value) {
    return (
      <option value={matchSpecificationOption.value}
              disabled={matchSpecificationForm.containsKey(matchSpecificationOption.value)}>
        {matchSpecificationOption.label}
      </option>
    );
  }

  return (
    <optgroup label={matchSpecificationOption.label}>
      {matchSpecificationOption.children.map((childMatchSpecificationOption, i) =>
        <MatchSpecificationItem matchSpecificationOption={childMatchSpecificationOption}
                                matchSpecificationForm={matchSpecificationForm}
                                key={i} />
      )}
    </optgroup>
  );
}


export default function MatchSpecificationSelector({id, matchSpecificationForm,
    matchSpecificationOptionsTree, helpTexts, onChangeMatchOption}) {
  return (
    <FormGroup>
      <Label htmlFor={`${id}-select-match-rule`}>Match</Label>
      <Select id={`${id}-select-match-rule`}
              onChange={onChangeMatchOption}>
        <option value=''>Please Select</option>

        {matchSpecificationOptionsTree.map((matchSpecificationOption, i) =>
          <MatchSpecificationItem matchSpecificationOption={matchSpecificationOption}
                                  matchSpecificationForm={matchSpecificationForm}
                                  key={i} />
        )}
      </Select>
      {matchSpecificationForm.error ?
        <ValidationBlock hasError>
          {matchSpecificationForm.error}
        </ValidationBlock>
      : null}
      <HelpBlock>
        {helpTexts.matchesHelp}
      </HelpBlock>
    </FormGroup>
  );
}
