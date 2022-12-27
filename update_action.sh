echo "Building node.js code"
npm run build

echo "Updating action"
ibmcloud fn action update \
    gccp-sync --docker ibnjunaid/gccp-sync:0.0.1 \
    ./dist/bundle.js --main global.main \
    --param CRED $CRED