const child_process = require('child_process');
const config = require('./config');
const octokit = require('./octokit');

const get = async () => {
  const pr = await octokit.pulls.get({
    owner: config.owner,
    repo: config.repo,
    pull_number: config.pr
  });
  return pr.data;
};

const checkOut = async () => {
  const pr = await get();
  try {
    child_process.execFileSync('git', ['clone', pr.head.repo.clone_url, '--branch', pr.head.ref, config.jkubeDir], {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Couldn't check out #${config.pr}:\n${error.status}: ${error.message}`);
  }
};

module.exports = {
  checkOut,
  get
};
