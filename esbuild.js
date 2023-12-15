const process = require('node:process')
const { build } = require('esbuild')

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
}

const extensionConfig = {
  ...baseConfig,
  platform: 'node',
  mainFields: ['module', 'main'],
  format: 'cjs',
  entryPoints: ['./src/extension.ts'],
  outfile: './out/extension.js',
  external: ['vscode'],
}

const watchConfig = {
  watch: {
    onRebuild(error, _result) {
      if (error) {
        error.errors.forEach(error =>
          console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`),
        )
      }
    },
  },
}

const webviewConfig = {
  ...baseConfig,
  target: 'es2020',
  format: 'esm',
  entryPoints: ['./src/webview/main.mts'],
  outfile: './out/webview.js',
};

(async () => {
  const args = process.argv.slice(2)
  try {
    if (args.includes('--watch')) {
      // Build and watch extension and webview code
      await build({
        ...extensionConfig,
        ...watchConfig,
      })
      await build({
        ...webviewConfig,
        ...watchConfig,
      })
    }
    else {
      // Build extension and webview code
      await build(extensionConfig)
      await build(webviewConfig)
    }
  }
  catch (err) {
    process.stderr.write(err.stderr)
    process.exit(1)
  }
})()
