/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Edit, TrashCan } from '@carbon/icons-react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { CarbonToastNotification, CarbonInlineLoading, Typography } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import { ApiTeam, deleteTeam, getTeam, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import TeamForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamForm';
import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { SETTINGS_TEAM_UPDATE } from 'in-services/tracking/eventNames';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

import locals from './Team.mless';

const Team = ({ match }: RouteComponentProps<{ id: string }>) => {
  const [isLoading, setLoading] = useState(true);
  const [team, setTeam] = useState<ApiTeam>({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {}
  });
  const [editTeam, setEditTeam] = useState<ApiTeam>(team);
  const [isValid, setValid] = useState(true);
  const [isEditNameDescription, setEditNameDescription] = useState(false);
  const [message, setMessage] = useState<Notification>();
  const { unstable_trackEvent } = useSegmentTracking();
  const { goToPath } = useNavigation();

  useEffect(() => {
    // Load team from URL id
    getTeam(match.params.id).once(
      data => {
        setTeam(data);
        setLoading(false);
      },
      error => {
        setMessage({
          kind: 'error',
          title: t('in-settings:tabs.teams.failedToLoadTeam'),
          subtitle: error.message
        });
      }
    );
  }, [match.params.id]);

  const setTeamData = ({ tag, info }: Partial<ApiTeam>) => {
    setEditTeam(previous => {
      return {
        ...previous,
        tag: tag as string,
        info: { ...previous?.info, description: info?.description as string }
      };
    });
  };

  // Update team
  const saveTeamHandler = () => {
    saveTeam(editTeam).once(
      savedTeam => {
        setTeam(savedTeam.body);

        setMessage({
          kind: 'success',
          title: t('in-settings:tabs.teams.teamSuccessfullySaved'),
          timeout: 3000
        });

        // Track team update via Segment
        const customData = {
          id: savedTeam.body.id
        };
        unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_TEAM_UPDATE }, customData);
      },
      error => {
        setMessage({
          kind: 'error',
          title: t('in-settings:tabs.teams.failedToSaveTeam'),
          subtitle: error.message
        });
      }
    );
  };

  const deleteTeamHandler = () => {
    close();
    deleteTeam(team?.id).once(
      () => {
        goToPath(`${securityAndAccessAccessControlTeams}`);
      },
      error => {
        setMessage({
          kind: 'error',
          title: t('in-settings:components.failedToRemoveItem'),
          subtitle: `(${team.id}): ${error.message}`
        });
      }
    );
  };

  return (
    <div>
      {message && <CarbonToastNotification className={locals.toastMessage} lowContrast {...message} />}
      <ProductiveCard
        className={locals.nameAndDescriptionCard}
        title={t('in-settings:tabs.teams.teamNameAndDescription')}
        actionIcons={[
          {
            icon: TrashCan,
            iconDescription: t('in-settings:tabs.teams.delete'),
            id: '1',
            onClick: () => {
              addActiveDialog(
                <ConfirmationDialog
                  header={t('in-settings:components.pleaseConfirm')}
                  description={
                    <Trans
                      i18nKey="in-settings:components.confirmRemoveItem"
                      values={{ itemName: t('in-settings:tabs.teams.teamWithName', { name: team.tag }) }}
                    />
                  }
                  onSubmit={deleteTeamHandler}
                  confirmButtonLabel={t('in-settings:tabs.remove')}
                  confirmButtonKind="danger"
                  confirmButtonAutoFocus
                />
              );
            }
          },
          {
            icon: Edit,
            iconDescription: t('in-settings:tabs.teams.edit'),
            id: '2',
            onClick: () => {
              setEditTeam({ ...team });
              setEditNameDescription(previous => !previous);
            }
          }
        ]}
        {...(isEditNameDescription
          ? {
              primaryButtonDisabled: !isValid,
              primaryButtonText: t('in-settings:tabs.save'),
              primaryButtonPlacement: 'bottom',
              onPrimaryButtonClick: () => {
                // Save name/description edit
                setTeam(previous => {
                  return {
                    ...previous,
                    tag: editTeam?.tag,
                    info: { ...previous?.info, description: editTeam?.info?.description }
                  };
                });
                saveTeamHandler();
                setEditNameDescription(previous => !previous);
              },
              secondaryButtonText: t('in-settings:tabs.cancel'),
              secondaryButtonPlacement: 'bottom',
              onSecondaryButtonClick: () => {
                // Cancel name/description edit
                setEditTeam({ ...team });
                setEditNameDescription(previous => !previous);
              }
            }
          : {})}
      >
        {isLoading && <CarbonInlineLoading />}
        {!isLoading && (
          <TeamForm
            editable={isEditNameDescription}
            name={isEditNameDescription ? editTeam?.tag : team?.tag}
            description={isEditNameDescription ? editTeam?.info?.description : team?.info?.description}
            setValid={setValid}
            setTeamData={setTeamData}
            {...(isEditNameDescription ? { originalName: team.tag } : {})}
          />
        )}
      </ProductiveCard>

      <div className={locals.row}>
        <div className={locals.column}>
          <ProductiveCard
            title={t('in-settings:tabs.teams.members')}
            primaryButtonPlacement="top"
            primaryButtonText={t('in-settings:tabs.teams.addUsers')}
          >
            {isLoading && <CarbonInlineLoading />}
            {!isLoading && (
              <>
                <Typography variant="heading-03">{t('in-settings:tabs.teams.noMembersYet')}</Typography>
                <Typography variant="body-01">{t('in-settings:tabs.teams.noMembersDefinedMessage')}</Typography>
              </>
            )}
          </ProductiveCard>
        </div>
        <div className={locals.column}>
          <ProductiveCard
            title={t('in-settings:tabs.teams.teamScope')}
            actionIcons={[
              {
                icon: Edit,
                iconDescription: t('in-settings:tabs.teams.edit'),
                id: '1',
                onClick: () => {}
              }
            ]}
          >
            {isLoading && <CarbonInlineLoading />}
            {!isLoading && (
              <>
                <Typography variant="heading-03">
                  {config.tenantUnit}-{config.tenant}
                </Typography>
                <Typography variant="body-01">{t('in-settings:tabs.teams.teamScopeNotDefinedMessage')}</Typography>
              </>
            )}
          </ProductiveCard>
        </div>
      </div>

      <ProductiveCard title={t('in-settings:tabs.teams.teamTagUsedOn')}>
        {isLoading && <CarbonInlineLoading />}
        {!isLoading && (
          <>
            <Typography variant="heading-03">{t('in-settings:tabs.teams.noDataYet')}</Typography>
            <Typography variant="body-01">{t('in-settings:tabs.teams.teamTagUsedOnEntitiesMessage')}</Typography>
          </>
        )}
      </ProductiveCard>
    </div>
  );
};

export default Team;
