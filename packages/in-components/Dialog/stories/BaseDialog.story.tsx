/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography, Button } from '@instana/components';

import BaseDialog from 'in-components/Dialog/BaseDialog';
import { noop } from 'in-services/util/function';

export default {
  component: BaseDialog
};

export const KindPrimary = () => (
  <BaseDialog onSubmit={noop} title={'My Prompt Title'} customButtons={<CustomButtons />}>
    <Typography variant="body-regular">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </Typography>
  </BaseDialog>
);

function CustomButtons() {
  return (
    <>
      <Button
        kind="primaryv2"
        target="_blank"
        href=""
        // @ts-expect-error Property 'rel' does not exist on type 'IntrinsicAttributes & PropsType & RefAttributes <any>'.
        rel="noopener noreferrer"
        onClick={() => {}}
      >
        First Button
      </Button>
      <Button kind="secondary" target="_blank" onClick={() => {}}>
        Second Button
      </Button>
    </>
  );
}
