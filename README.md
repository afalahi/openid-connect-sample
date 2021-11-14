# OpenID Connect Sample in Node.js

This is a sample application showing how to configure and enable OpenID Connect middleware in a Node.js web application with Express using ForgeRock ID Cloud as the OP.

## Running the sample

Create a `.env` file in the root and add your environment variables from your FR IDC tenant

    CLIENT_ID=
    CLIENT_SECRET=
    IDC_TENANT=https://<YOUR_TENANT_BASE_URL>/am/oauth2/realms/alpha/
    REDIRECT_URL=http://localhost:3000

Run `npm install` to install all dependencies.

Run `npm start` to start the server.

You can access the app on [http://localhost:3000](http://localhost:3000).
