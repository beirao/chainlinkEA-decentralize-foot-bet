# Chainlink NodeJS External Adapter for football-data.org

This repository is a part of the Decentralize foot bet Dapp.
This is the Chainlink external adapter that able all the deployed smart contracts to know which team win.
Powered by [football-data.org](https://www.football-data.org) API.

## Input Params

-   `matchId`: The ID of the match you want the winner.

## Output

```
SCHEDULED | IN GAME => 0
HOME WIN            => 1
AWAY WIN            => 2
DRAW                => 3
MATCH CANCELLED     => 4
```

```json
{
    "jobRunID": 0,
    "data": { "winId": 0, "result": null },
    "result": null,
    "statusCode": 200
}
```

## Install Locally

Install dependencies:

```bash
yarn
```

### Test

Run the local tests:

```bash
yarn test
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Call the external adapter/API server

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "matchId": ID}}'
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
sudo docker build . -t external-adapter
```

Then run it with:

```bash
sudo docker run -p 8080:8080 -it external-adapter:latest
```

## Serverless hosts

After [installing locally](#install-locally):

### Create the zip

```bash
zip -r external-adapter.zip .
```

### Install to AWS Lambda

-   In Lambda Functions, create function
-   On the Create function page:
    -   Give the function a name
    -   Use Node.js 12.x for the runtime
    -   Choose an existing role or create a new one
    -   Click Create Function
-   Under Function code, select "Upload a .zip file" from the Code entry type drop-down
-   Click Upload and select the `external-adapter.zip` file
-   Handler:
    -   index.handler for REST API Gateways
    -   index.handlerv2 for HTTP API Gateways
-   Add the environment variable (repeat for all environment variables):
    -   Key: API_KEY
    -   Value: Your_API_key
-   Save

#### To Set Up an API Gateway (HTTP API)

If using a HTTP API Gateway, Lambda's built-in Test will fail, but you will be able to externally call the function successfully.

-   Click Add Trigger
-   Select API Gateway in Trigger configuration
-   Under API, click Create an API
-   Choose HTTP API
-   Select the security for the API
-   Click Add

#### To Set Up an API Gateway (REST API)

If using a REST API Gateway, you will need to disable the Lambda proxy integration for Lambda-based adapter to function.

-   Click Add Trigger
-   Select API Gateway in Trigger configuration
-   Under API, click Create an API
-   Choose REST API
-   Select the security for the API
-   Click Add
-   Click the API Gateway trigger
-   Click the name of the trigger (this is a link, a new window opens)
-   Click Integration Request
-   Uncheck Use Lamba Proxy integration
-   Click OK on the two dialogs
-   Return to your function
-   Remove the API Gateway and Save
-   Click Add Trigger and use the same API Gateway
-   Select the deployment stage and security
-   Click Add

### Install to GCP

-   In Functions, create a new function, choose to ZIP upload
-   Click Browse and select the `external-adapter.zip` file
-   Select a Storage Bucket to keep the zip in
-   Function to execute: gcpservice
-   Click More, Add variable (repeat for all environment variables)
    -   NAME: API_KEY
    -   VALUE: Your_API_key
