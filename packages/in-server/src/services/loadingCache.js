/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

exports.createLoadingCache = ({ ttl = 10000 }) => {
  // cache key => promise
  let cache = {};

  // clear the cache periodically
  // unref() ensures the process is not blocked from exiting on SIGTERM or SIGINT.
  setInterval(() => (cache = {}), ttl).unref();

  return (key, load) => {
    if (cache[key]) {
      return cache[key];
    }

    cache[key] = load();
    return cache[key];
  };
};
