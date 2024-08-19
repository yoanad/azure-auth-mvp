from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from datetime import datetime, timedelta
from typing import Union
from jose import JWTError, jwt
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure Key Vault and ClientSecretCredential usage
key_vault_url = os.getenv("AZURE_KEY_VAULT_URL")
client_id = os.getenv("AZURE_CLIENT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")
tenant_id = os.getenv("AZURE_TENANT_ID")

credential = ClientSecretCredential(
    tenant_id=tenant_id,
    client_id=client_id,
    client_secret=client_secret
)

secret_client = SecretClient(vault_url=key_vault_url, credential=credential)

# Fetch secret values from Azure Key Vault
SECRET_KEY = secret_client.get_secret("SECRET_KEY").value
ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 15

users_db = {}

class User(BaseModel):
    username: str
    email: str
    password: str

def create_jwt_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/generate-token")
async def generate_token(client_secret: str = Header(...)):
    if client_secret != os.getenv("CLIENT_SECRET"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = {"role": "frontend"}
    token = create_jwt_token(data)
    return {"token": token}

@app.post("/api/register")
async def register(user: User, Authorization: str = Header(...)):
    token = Authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "frontend":
            raise HTTPException(status_code=401, detail="Unauthorized role")

        if user.email in users_db:
            raise HTTPException(status_code=400, detail="User already registered")

        users_db[user.email] = user
        return {"message": "User registered successfully"}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token decode error: {str(e)}")

@app.get("/api/secure-data")
async def read_secure_data(Authorization: str = Header(...)):
    token = Authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "This is secure data", "data": payload}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)