/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Button, Stack } from '@instana/components';
import { Link } from '@instana/carbon';

import AlertConfigTearSheetDialog, {
  AlertStackedDialog
} from 'in-alerting/smart-alerts/components/tearSheetDialog/AlertConfigTearSheetDialog';

export default { component: AlertConfigTearSheetDialog };

export const TearSheet = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenStackedModal, setIsOpenStackedModal] = useState(false);
  const [isOpenStackedModal2, setIsOpenStackedModal2] = useState(false);

  const title = 'Create a Smart Alert';
  const subtitle = <Link href=""> Learn more in IBM Docs.</Link>;

  const stackedProps = {
    stackedLabel: 'Create a Smart Alert',
    stackedTitle: 'Dialog title',
    stackedDescription: 'Sample description'
  };

  const handleOpenModalClick = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenStackedModal = () => {
    setIsOpenStackedModal(true);
  };

  const handleCloseStackedModal = () => {
    setIsOpenStackedModal(false);
  };

  const handleOpenStackedModal2 = () => {
    setIsOpenStackedModal2(true);
  };

  const handleCloseStackedModal2 = () => {
    setIsOpenStackedModal2(false);
  };

  const stepArray = [
    { title: 'Step 1', component: <>Step 1 content</> },
    { title: 'Step 2', component: <>Step 2 content</> },
    {
      title: 'Step 3',
      component: (
        <Stack gap={'small'}>
          Step 3 content
          <Stack gap={'small'} direction="horizontal">
            <Button onClick={handleOpenStackedModal}>Open Modal 1</Button>
            <Button onClick={handleOpenStackedModal2}>Open Modal 2</Button>
          </Stack>
          <AlertStackedDialog
            stackedLabel={stackedProps.stackedLabel}
            stackedTitle={stackedProps.stackedTitle}
            stackedDescription={stackedProps.stackedDescription}
            open={isOpenStackedModal}
            onClose={handleCloseStackedModal}
            content={'Dialog content'}
            handleSubmit={handleCloseStackedModal}
            preventCloseOnClickOutside
          />
          <AlertStackedDialog
            stackedLabel={stackedProps.stackedLabel}
            stackedTitle={stackedProps.stackedTitle}
            stackedDescription={stackedProps.stackedDescription}
            open={isOpenStackedModal2}
            onClose={handleCloseStackedModal2}
            content={'Dialog content 2'}
            handleSubmit={handleCloseStackedModal2}
            preventCloseOnClickOutside
          />
        </Stack>
      ),
      stackedComponent: <>Stack 1</>
    }
  ];

  return (
    <>
      <Button onClick={handleOpenModalClick}>Open Tearsheet</Button>
      <AlertConfigTearSheetDialog
        onClose={handleCloseModal}
        open={isOpen}
        stepArray={stepArray}
        title={title}
        subtitle={subtitle}
        handleSubmit={() => handleCloseModal()}
      />
    </>
  );
};
