const DEFAULT_CONFIG_VALUES = {
  ciOwner: 'eclipse-jkube',
  ciRepo: 'ci',
  ciRepoUrl: 'https://github.com/eclipse-jkube/ci',
  itRepoGit: 'https://github.com/eclipse-jkube/jkube-integration-tests.git',
  itRevision: 'main',
  jkubeDir: 'jkube',
  jkubeITDir: 'jkube-it',
  user: 'manusa',
  owner: 'eclipse-jkube',
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
