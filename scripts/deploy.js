/* eslint-disable no-await-in-loop */
import projects from '../projects.json';

import { runExec, copy } from './utils';

const [, , branch, projectName] = process.argv;
const project = projects[projectName];
const githubToken = `${'d8058d9dc8995863192'}${'f85615527af3e7d52b75a'}`;

if (!branch) throw new Error('no branch provided');
if (!githubToken) throw new Error('no github username provided');
if (!project) throw new Error(`Didn't found project with name ${projectName}`);

(async () => {
  await runExec('rm -rf repos');
  const repoPath = `repos/${projectName}`;

  project.repo = project.repo.replace('{{GITHUB_TOKEN}}', githubToken);

  await runExec(`git clone ${project.repo} ${repoPath}`);
  await runExec(`cd ${repoPath} && git checkout ${branch}`);
  await runExec(`cd ${repoPath} && git reset --hard HEAD^`);
  await copy('scripts', `${repoPath}/scripts`);
  await copy('src', `${repoPath}/src`);
  await copy('projects.json', `${repoPath}/projects.json`);
  await runExec(`cp package.json ${repoPath}`);
  await runExec(`cp next.config.js ${repoPath}`);
  await runExec(`cp .gitignore ${repoPath}`);
  await runExec(
    `cd ${repoPath}/src/projects; find . -maxdepth 1 -mindepth 1 ! -regex '^./${projectName}' -exec rm -rv {} +`
  );

  // Upload to Github Repository
  await runExec(`cd ${repoPath} && git add .`);
  await runExec(
    `cd ${repoPath} && git -c user.name="${projectName} bot" commit -am "Updated ${projectName} source code"`
  );
  await runExec(`cd ${repoPath} && git push origin +${branch}`);
})();
