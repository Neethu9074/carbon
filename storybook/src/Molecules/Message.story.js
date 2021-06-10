/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { success, warning, error } from 'in-components/Message/types';
import Message from 'in-components/Message';

export default {
  title: 'Molecules|Message',
  component: Message
};

export const DefaultMessage = () => {
  return (
    <>
      <Message title="This is a message." />
      <Message title="This is a title" description="And this is a description." />
    </>
  );
};

export const DefaultMessageSmallSize = () => {
  return (
    <>
      <Message small title="This is a message." />
      <Message small title="This is a title" description="And this is a description." />
    </>
  );
};

export const DismissibleMessage = () => {
  return (
    <>
      <Message dismissible title="This is a message." />
      <Message dismissible title="This is a title" description="And this is a description." />
    </>
  );
};

export const DismissibleMessageWithIcon = () => {
  return (
    <>
      <Message withIcon dismissible title="This is a dismissible message showing an optional icon." />
      <Message
        withIcon
        dismissible
        title="This is a title"
        description="This is a dismissible message showing an optional icon."
      />
    </>
  );
};

export const BoldMessageWithIcon = () => {
  return (
    <>
      <Message withIcon bold title="This is a message." />
      <Message withIcon bold title="This is a title" description="And this is a description." />
    </>
  );
};

export const DismissibleMessageWithIconSmallSize = () => {
  return <Message withIcon dismissible small title="This is a dismissible message showing an optional icon." />;
};

export const Types = () => {
  return (
    <>
      <Message withIcon title="This is a neutral message" />
      <Message withIcon title="This is a neutral message" description="This is a description" />
      <Message type={success} withIcon title="This is a success message" />
      <Message type={success} withIcon title="This is a success message" description="This is a description" />
      <Message type={warning} withIcon title="This is a warning message" />
      <Message type={warning} withIcon title="This is a warning message" description="This is a description" />
      <Message type={error} withIcon title="This is an errror message" />
      <Message type={error} withIcon title="This is an errror message" description="This is a description" />
    </>
  );
};

export const CustomContent = () => {
  return (
    <Message withIcon type={warning}>
      <div>
        <strong>title</strong>
        <p />
        <p>paragraph</p>
      </div>
    </Message>
  );
};
