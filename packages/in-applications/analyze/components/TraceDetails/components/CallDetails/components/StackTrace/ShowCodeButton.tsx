/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

//@ts-expect-error needs TS migration
import { getCodeView, supportsCodeView } from 'in-sdk/snapshot';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SnapshotData } from 'in-stores/snapshot';

interface ShowCodeButtonProps {
  snapshot: SnapshotData;
  file: string;
  line: string;
  children: JSX.Element | string;
}

export default function ShowCodeButton({ snapshot, file, line, children }: ShowCodeButtonProps): JSX.Element {
  if (!supportsCodeView(snapshot, file)) {
    return <>{children}</>;
  }

  return (
    <a href="" onClick={showCodeView}>
      {children}
    </a>
  );

  function showCodeView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addActiveDialog(getCodeView(snapshot, file, line));
  }
}
