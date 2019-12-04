const presets = [
  [
    '@babel/env',
    {
      targets: {
        // would be the same as process.versions.node
        node: 'current',
      },
    },
  ],
];

module.exports = { presets };
