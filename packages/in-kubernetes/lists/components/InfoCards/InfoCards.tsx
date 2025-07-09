/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import InfoCardHeader, { CardHeader } from 'in-kubernetes/lists/components/InfoCardHeader/InfoCardHeader';
import InfoCard from 'in-kubernetes/lists/components/InfoCards/InfoCard';
import { Card } from 'in-kubernetes/lists/utils';

import locals from './InfoCards.mless';

export interface InfoCard {
  header: CardHeader;
  cards: Card[];
}

export default function InfoCards({ data }: { data?: InfoCard[] }) {
  if (!data) {
    return null;
  }

  return (
    <>
      {data?.map((infoCard: InfoCard) => (
        <div className={locals.infoCard}>
          <InfoCardHeader {...infoCard.header} />
          <Stack direction="horizontal">
            {infoCard?.cards?.map((card: Card, index: number) => (
              <InfoCard key={`${card.cardId}_${card.cardTitle}_${index}`} {...card} />
            ))}
          </Stack>
        </div>
      ))}
    </>
  );
}
