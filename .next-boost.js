// An example with default cache adapter: hybrid-disk-cache

/** @type {import('@next-boost/next-boost/dist/types').HandlerConfig} */
module.exports = {
  rules: [
    {
      regex: '.*',
      ttl: 10,
    },
  ],
};
