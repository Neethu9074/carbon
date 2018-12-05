import React from 'react';

import Button from 'in-new-components/Button';

import locals from './LearnMore.mless';

export default function LearnMore({ explanation, href, buttonLabel }) {
  return (
    <p className={locals.explanation}>
      {explanation}

      <Button href={href} kind="primaryv2" target="_blank" className={locals.button}>
        {buttonLabel}
      </Button>
    </p>
  );
}
