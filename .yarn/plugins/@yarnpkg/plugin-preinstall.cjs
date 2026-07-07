module.exports = {
  name: `plugin-preinstall`,
  factory: (require) => {
    const { execSync } = require('child_process');
    const { existsSync, readFileSync } = require('fs');
    const path = require('path');

    return {
      hooks: {
        validateProject: async (project) => {
          if (process.env.SKIP_YARN_PREINSTALL === 'true') {
            return;
          }
          const pkgJsonPath = path.join(project.cwd, 'package.json');
          if (existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
            if (pkgJson.scripts && pkgJson.scripts.preinstall) {
              try {
                execSync(pkgJson.scripts.preinstall, {
                  cwd: project.cwd,
                  stdio: 'inherit',
                  shell: true,
                });
              } catch (e) {
                // preinstall failed
              }
            }
          }
        },
      },
    };
  },
};