const DEFAULT_CONFIG_VALUES = {
  ciRepo: 'https://github.com/jkubeio/ci',
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
  auth: computeAuth(),
  ...DEFAULT_CONFIG_VALUES,
  ...computeCommandLineArguments()
};

module.exports = config;
