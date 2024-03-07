/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { UserResult, getUser } from 'in-api/users';

export default function useGetUserDetail(userId: string) {
  const [user, setUser] = useState<UserResult>();
  const userResult = useObservable(getUser(userId), [userId]);

  useEffect(() => {
    if (userResult) {
      setUser(userResult);
    }
  }, [userResult]);

  return user;
}
