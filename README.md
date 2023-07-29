# speech-summary-app
Repository for a React Typescript / Flask app that does summaries of commencements speeches

Deploying to Azure for the first time use:

az webapp up --runtime PYTHON:3.10 --sku B1 --name <new-app-name> --resource-group <resource-group-name> --location <azure-region> --subscription <subscription-name>
