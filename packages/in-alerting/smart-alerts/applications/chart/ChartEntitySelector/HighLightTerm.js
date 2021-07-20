/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isBlank } from 'in-services/util/string';
import React from 'react';

export function HighLightTerm({ text, term }) {
  if (!term || isBlank(term)) {
    return <div>{text}</div>;
  }
  const lowText = text.toLowerCase();
  const loTerm = term.toLowerCase();
  const arr = [];
  let idxHit = lowText.indexOf(loTerm);
  let next = 0;
  let key = 0;

  const termLength = loTerm.length;

  while (idxHit >= 0) {
    arr.push(<span key={key++}>{text.slice(next, idxHit)}</span>);
    next = idxHit + termLength;
    arr.push(<strong key={key++}>{text.slice(idxHit, next)}</strong>);
    idxHit = lowText.indexOf(loTerm, next);
  }
  if (idxHit < 0 && next !== text.length) {
    arr.push(<span key={key++}>{text.slice(next)}</span>);
  }
  return <div>{arr}</div>;
}
