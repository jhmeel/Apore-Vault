import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/main.tsx'], // Adjust to your entry file
  bundle: true,
  outfile: 'dist/bundle.js', // Output file
  minify: true,
}).catch(() => process.exit(1));
