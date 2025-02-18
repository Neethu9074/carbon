/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Li, Link, Typography, Ul } from '@instana/components';
import { SloEntityType } from '@instana/types';

import Overlay from 'in-components/overlays/Overlay/Overlay';
import { t } from 'in-i18n';

import locals from './MultiEntityLabel.mless';

interface ContentProps {
  labels: string[];
}

interface MultiEntityLabelProps extends ContentProps {
  entityType: SloEntityType | 'test';
}

export default function MultiEntityLabel({ labels, entityType }: MultiEntityLabelProps) {
  return (
    <Overlay props={{ labels }} content={OverlayContent} align="auto">
      {({ toggle }) => (
        <Typography variant="body-regular">
          <span className={locals.link}>
            <Link onClick={toggle} ellipsis inline>
              {t('in-service-levels:general.format.event', {
                context: entityType,
                count: labels.length
              })}
            </Link>
          </span>
        </Typography>
      )}
    </Overlay>
  );
}

function OverlayContent({ labels }: ContentProps) {
  return (
    <Ul>
      {labels.map((label, index) => (
        <Li key={`overlay-label-${index}:${label}`}>{label}</Li>
      ))}
    </Ul>
  );
}
