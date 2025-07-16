/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Card, Link, Typography } from '@instana/components';

import { deleteLogsLocalisationStrings as t } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { DeleteLogsModal } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/DeleteLogsModal';
import DeleteLogsTearsheet from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/Tearsheet';
import { DeletionTable } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import { deleteLogsV3Enabled } from 'in-services/featureFlags';
import Title from 'in-components/Title/Title';

import locals from './DeleteLogs.mless';

export default function DeleteLogs() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [deletionInProgress, setDeletionInProgress] = useState(false);
  const { trackCta } = useSegmentTracking();

  const handleOpenModal = () => {
    trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED);
    setShowModal(true);
  };

  const handleIsInProgress = (isInProgress: boolean) => {
    setDeletionInProgress(isInProgress);
  };

  return (
    <>
      <Title title={t.deleteLogs} />
      <h2 className={locals.hiddenHeading} />
      <section className={locals.descriptionSection}>
        <Typography variant="body-regular">
          {t.info}
          <br />
          {t.info2}
          <Link externalWithIcon href={`${analyzeDocs.logs}#deleting-logs`} className={locals.underline}>
            {t.learnMore}
          </Link>
        </Typography>
      </section>
      <Card className={locals.noPadding}>
        <DeletionTable
          openConfirmationDialog={handleOpenModal}
          isDeleting={isDeleting}
          handleIsInProgress={handleIsInProgress}
        />
      </Card>
      {showModal &&
        (deleteLogsV3Enabled ? (
          <DeleteLogsTearsheet setIsOpen={setShowModal} isOpen={showModal} />
        ) : (
          <DeleteLogsModal
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            retryCount={retryCount}
            setRetryCount={setRetryCount}
            closeModal={() => setShowModal(false)}
            deletionInProgress={deletionInProgress}
          />
        ))}
    </>
  );
}
