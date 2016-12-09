/* eslint-disable import/no-extraneous-dependencies */

const git = require('git-rev-sync');
const jsonfile = require('jsonfile');

jsonfile.spaces = 2;

const vnumber = jsonfile.readFileSync('./package.json').version;

const tag = git.tag();
const short = git.short();
const branch = git.branch();
const message = git.message();

const versionObject = {
  tag,
  short,
  branch,
  message,
  vnumber,
};

jsonfile.writeFileSync('./server/version.json', versionObject);
