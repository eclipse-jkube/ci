const DEFAULT_CONFIG_VALUES = {
  ciOwner: 'jkubeio',
  ciRepo: 'ci',
  ciRepoUrl: 'https://github.com/jkubeio/ci',
  itRepoGit: 'https://github.com/jkubeio/jkube-integration-tests.git',
  itRevision: 'main',
  user: 'manusa',
  owner: 'eclipse',
  repo: 'jkube'
};

const computeAuth = (env = process.env) => {
  const accessToken = env.ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('No environment variable ACCESS_TOKEN was found');
  }
  return accessToken;
};

const computeCommandLineArguments = (argv = process.argv) => {
  const args = {};
  argv.slice(2).forEach((arg) => {
    if (arg.indexOf('--') === 0) {
      const argKV = arg.split('=');
      if (argKV.length !== 2) {
        throw new Error(`Invalid long argument ${arg}, expected format "--flag=value"`);
      }
      args[argKV[0].slice(2)] = argKV[1];
    }
  });
  return args;
};

const config = {
  __visible_for_testing__: {
    computeAuth,
    computeCommandLineArguments
  },
  auth: computeAuth(),
  ...DEFAULT_CONFIG_VALUES,
  ...computeCommandLineArguments()
};

module.exports = config;
