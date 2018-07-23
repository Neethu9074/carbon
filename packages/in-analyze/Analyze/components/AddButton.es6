import React from 'react';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';

import locals from './AddButton.mless';

export default function AddButton(props) {
  const { onClick, withApplicationOptions, text } = props;

  if (withApplicationOptions) {
    return (
      <Overlay content={Content} props={props} position="fixed">
        {({ open }) => (
          <Button className={locals.addButton} kind="primary" onClick={open}>
            {text}
          </Button>
        )}
      </Overlay>
    );
  }

  return (
    <Button className={locals.addButton} kind="primary" onClick={onClick}>
      {text}
    </Button>
  );
}

function Content({ tagFilters, onClick }) {
  const containsApplication = containsTag(tagFilters, APPLICATION.name);
  const containsService = containsTag(tagFilters, SERVICE.name);
  const containsEndpoint = containsTag(tagFilters, ENDPOINT.name);

  return (
    <ul className={locals.optionList}>
      <li className={locals.option}>
        <Button
          className={locals.addButton}
          kind="subtle"
          onClick={() => onClick(APPLICATION.name)}
          disabled={containsApplication}
        >
          {APPLICATION.label} {containsApplication && ' (already defined)'}
        </Button>
      </li>

      <li className={locals.option}>
        <Button
          className={locals.addButton}
          kind="subtle"
          onClick={() => onClick(SERVICE.name)}
          disabled={containsService}
        >
          {SERVICE.label} {containsService && ' (already defined)'}
        </Button>
      </li>

      <li className={locals.option}>
        <Button
          className={locals.addButton}
          kind="subtle"
          onClick={() => onClick(ENDPOINT.name)}
          disabled={containsEndpoint || !containsService}
        >
          {ENDPOINT.label} {containsEndpoint && containsService && ' (already defined)'}{' '}
          {!containsService && ' (please add a service)'}
        </Button>
      </li>
      <li className={locals.option}>
        <Button className={locals.addButton} kind="subtle" onClick={onClick}>
          Other
        </Button>
      </li>
    </ul>
  );
}

function containsTag(tagFilters = [], tagName) {
  for (let i = 0; i < tagFilters.length; i++) {
    if (tagFilters[i].name === tagName) {
      return true;
    }
  }
  return false;
}
