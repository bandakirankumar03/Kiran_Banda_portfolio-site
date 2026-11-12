The published site uses local production React libraries and a precompiled, fingerprinted script. Visitors do not download Babel or compile JSX.

Edit the JSX files listed in source-scripts.json, then run:

    npm install
    npm run build

Commit the changed JSX, generated assets/site-*.js and index.html together. Netlify continues serving deploy_v02 as a static site. Design study pages retain their existing independent sources.
