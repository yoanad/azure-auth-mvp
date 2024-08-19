# Azure Auth MVP

## Overview

This project demonstrates secure communication between a Next.js frontend and a FastAPI backend using Azure Key Vault to manage application secrets. This setup uses client secrets, managed by Azure Key Vault, and JWT tokens to ensure secure interactions between the frontend and backend, without requiring user-specific authentication.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Azure Setup](#azure-setup)
  - [Local Setup](#local-setup)
- [Usage](#usage)
- [Detailed Explanation](#detailed-explanation)
  - [Concepts](#concepts)
  - [Packages](#packages)
  - [Security Practices](#security-practices)
- [Contributing](#contributing)
- [License](#license)

## Architecture

1. **Azure Key Vault**: Securely stores application secrets.
2. **FastAPI**: Python-based backend framework for building APIs.
3. **Next.js**: React-based frontend framework for building server-rendered applications.

## Requirements

- Azure Subscription
- Node.js and npm
- Python 3.6+ and pip
- Azure CLI

## Setup

### Azure Setup

1. **Login to Azure**

   ```bash
   az login
   ```

2. **Create Azure Key Vault**

   ```bash
   az keyvault create --name <YourKeyVaultName> --resource-group <YourResourceGroupName> --location <YourLocation>
   ```

3. **Add Secrets to Key Vault**

   ```bash
   az keyvault secret set --vault-name <YourKeyVaultName> --name "SECRET_KEY" --value "<YourSecretKeyValue>"
   az keyvault secret set --vault-name <YourKeyVaultName> --name "CLIENT_SECRET" --value "<YourClientSecret>"
   az keyvault secret set --vault-name <YourKeyVaultName> --name "AZURE_CLIENT_ID" --value "<YourClientId>"
   az keyvault secret set --vault-name <YourKeyVaultName> --name "AZURE_TENANT_ID" --value "<YourTenantId>"
   ```

4. **Set Access Policies**
   ```bash
   az keyvault set-policy --name <YourKeyVaultName> --spn <appId> --secret-permissions get list
   ```

### Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yoanad/azure-auth-mvp.git
   cd azure-auth-mvp
   ```

2. **Backend Setup**

   - Navigate to the backend directory

     ```bash
     cd backend
     ```

   - Create a virtual environment

     ```bash
     python3 -m venv env
     source env/bin/activate
     ```

   - Install dependencies

     ```bash
     pip install -r requirements.txt
     ```

   - Create a `.env` file and add the following

     ```plaintext
     AZURE_KEY_VAULT_URL=https://<your-key-vault-name>.vault.azure.net/
     AZURE_CLIENT_ID=<your-app-id>
     AZURE_CLIENT_SECRET=<your-client-secret>
     AZURE_TENANT_ID=<your-tenant-id>
     ```

   - Run the FastAPI server
     ```bash
     uvicorn main:app --reload
     ```

3. **Frontend Setup**

   - Navigate to the frontend directory

     ```bash
     cd frontend
     ```

   - Install dependencies

     ```bash
     npm install
     ```

   - Create a `.env.local` file and add the following

     ```plaintext
     NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
     NEXT_PUBLIC_CLIENT_SECRET=<your-client-secret>
     ```

   - Run the Next.js server
     ```bash
     npm run dev
     ```

## Usage

1. Navigate to `http://localhost:3000`.
2. You should see the registration form. Fill out the form to register a new user.
3. The backend will use JWTs and manage secrets using Azure Key Vault.

## Detailed Explanation

### Concepts

**JSON Web Tokens (JWTs)**: JWTs are a compact, URL-safe means of representing claims to be transferred between two parties. JWTs are often used in the context of authentication and authorization.

**HTTP Cookies**: An HTTP cookie is a small piece of data sent from a server to the user's web browser. The browser stores the cookie and sends it back with the next request to the same server.

**Token Rotation**: Token rotation involves regularly updating tokens to ensure security. This typically includes short-lived access tokens and long-lived refresh tokens.

**Azure Key Vault**: Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. By using Key Vault, you can securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets.

### Packages

#### Backend

1. **FastAPI**: A modern, fast web framework for building APIs.
2. **Uvicorn**: A lightning-fast ASGI server.
3. **Python-JOSE**: Provides JWT encoding and decoding capabilities.
4. **Python-Dotenv**: Reads `.env` files and sets environment variables.
5. **Azure-Identity**: Provides Azure Active Directory tokens.
6. **Azure-Keyvault-Secrets**: Provides access to secrets in Azure Key Vault.

#### Frontend

1. **Next.js**: A React-based framework for server-side rendering.
2. **Axios**: A promise-based HTTP client.
3. **Js-Cookie**: A simple, lightweight library for handling cookies.

### Security Practices

**Use of Azure Key Vault**: All secrets are stored and managed within Azure Key Vault to ensure they remain secure.
**JWT Tokens**: Secure access and refresh tokens are used for authenticating users.
**Environment Variables**: Sensitive information is stored in environment variables to prevent exposure.
**CORS Configuration**: Proper CORS configuration ensures that only allowed origins can access the backend.

### License

This project is licensed under the MIT License.
