# umd-barcode-lookup

umd-barcode-lookup is a Google Cloud Function that takes in a UMCP library barcode value and looks up the information in the University
of Maryland LDAP directory. It is needed because the LDAP directory has secret credentials required for access.

## Deploying

### Setting up your GCP account

1. Create a project to deploy under
2. Enable serverless APIs: [Click here](https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions,cloudbuild.googleapis.com,artifactregistry.googleapis.com,run.googleapis.com,logging.googleapis.com&redirect=https://cloud.google.com/functions/quickstart&_ga=2.247111364.1517727458.1674591132-1513881007.1662507950)
3. Enable secret manager APIs: [Click here](https://console.cloud.google.com/flows/enableapi?apiid=secretmanager.googleapis.com&_ga=2.155368315.1517727458.1674591132-1513881007.1662507950)

### Deploying the code

Before you start, ensure you have the `gcloud` CLI installed.

1. Clone the repo
2. Set up `.env.yaml` with your LDAP DN for access
3. Set your LDAP password by running `npm run setsecret:LDAP_PASSWORD -- <password>`
4. Build the function: `npm run predeploy`
5. Deploy the function: `npm run deploy`

The URL to the function will be in the output of the deploy command.
