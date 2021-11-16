# OpenID Connect Sample in Node.js

This is a sample application showing how to configure and enable OpenID Connect middleware in a Node.js web application with Express using ForgeRock ID Cloud as the OP.

## ForgeRock Identity Cloud setup

- Create a web/confidential client
- Ensure you have the Authorization Code grant selected in grant types
- In Show advanced settings > Authentication ensure you have client_secret_post in your Token Endpoint Authentication Method
- in your sign in URLs add http://localhost:3000/auth/callback
- Update your scopes as needed, but make sure openid is there

## Running the sample

Create a `.env` file in the root and add your environment configuration from your FR IDC tenant. You'll need to create a Web/Confidential client

    CLIENT_ID=
    CLIENT_SECRET=
    IDC_TENANT=https://<YOUR_TENANT_BASE_URL>/am/oauth2/realms/alpha/
    REDIRECT_URL=http://localhost:3000

Run `npm install` to install all dependencies.

Run `npm start` to start the server.

You can access the app on [http://localhost:3000](http://localhost:3000).
