const fs = require('fs');
const { remarkExtend } = require('remark-extend');

function isLion(filePath) {
  return filePath.indexOf('@lion/') !== -1;
}

function getLocalOverridePath(filePath, root = process.cwd()) {
  const rel = filePath.substring(filePath.indexOf('/@lion/') + 7, filePath.length - 3);
  return `${root}/packages/${rel}.override.md`;
}

module.exports = {
  stories: [
    '../node_modules/@lion/tabs/README.md',
    '../packages/**/!(*.override)*.md'
  ],
  addons: [
    // order of tabs in addons panel
    'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
    'storybook-prebuilt/addon-docs/register.js',
    // no tab in addons panel (e.g. load order does not matter here)
    'storybook-prebuilt/addon-backgrounds/register.js',
    'storybook-prebuilt/addon-links/register.js',
    'storybook-prebuilt/addon-viewport/register.js',
  ],
  setupMdjsPlugins: (plugins, filePath) => {
    if (!isLion(filePath)) {
      return plugins;
    }
    const newPlugins = [...plugins];
    const markdownIndex = newPlugins.findIndex(plugin => plugin.name === 'markdown');
    const overridePaths = [getLocalOverridePath(filePath), `${process.cwd()}/.storybook/all.override.md`];

    let i = 0;
    for (const overridePath of overridePaths) {
      if (fs.existsSync(overridePath)) {
        const extendMd = fs.readFileSync(overridePath, 'utf8');
        newPlugins.splice(markdownIndex, 0, {
          name: `remarkExtend${i}`,
          plugin: remarkExtend.bind({}),
          options: { extendMd, filePath, overrideFilePath: overridePath },
        });
      }
      i += 1;
    }
    return newPlugins;
  },
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
    babel: true,
  },
};
