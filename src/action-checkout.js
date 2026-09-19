const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const pullRequests = require('./pull-requests');

const rmDir = (relativeSrcPath) => {
  const dir = path.resolve(__dirname, '..', relativeSrcPath);
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, {recursive: true});
  }
};

const checkOutPRBranch = async () => {
  console.log(`Checking out JKube repository for PR...`);
  rmDir(config.jkubeDir);
  await pullRequests.checkOut();
};

const installJKube = () => {
  try {
    console.log(`Installing JKube project from PR...`);
    child_process.execFileSync('mvn', ['-B', '-f', `${config.jkubeDir}/pom.xml`, '-DskipTests', 'clean', 'install'], {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Problem executing Maven Install for JKube:\n${error.status}: ${error.message}`);
  }
};

const checkOutITRepo = async () => {
  console.log(`Checking out JKube IT (${config.itRepoGit} repository (${config.itRevision})...`);
  rmDir(config.jkubeITDir);
  try {
    child_process.execFileSync('git', ['clone', config.itRepoGit, '--branch', config.itRevision, config.jkubeITDir], {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Couldn't check out JKube IT repository:\n${error.status}: ${error.message}`);
  }
};

const actionCheckout = async () => {
  for (const func of [checkOutPRBranch, installJKube, checkOutITRepo]) {
    await func();
  }
};

module.exports = actionCheckout;
