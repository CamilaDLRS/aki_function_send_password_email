

# aki_function_send_password_email

## Overview
This Azure Function sends password setup and recovery emails to teachers in the AKI system.


## Features
- HTTP POST endpoint: `/api/email`
- Validates request payload using Zod
- Supports both setup and recovery flows via `emailType` field in the payload
- Sends email via SendGrid (with retry logic)
- Logs all operations for audit
- Returns clear error responses for validation and provider failures


## Request Example (Setup)
```json
POST /api/email/password-setup
Content-Type: application/json

{
	"teacher_id": 45,
	"teacher_email": "ana.silva@school.com",
	"teacher_name": "Ana Silva",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"expires_at": "2025-10-24T00:00:00Z",
	"emailType": "setup"
}
```

## Request Example (Recovery)
```json
POST /api/email
Content-Type: application/json

{
	"teacher_email": "ana.silva@school.com",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"expires_at": "2025-10-24T00:00:00Z",
	"emailType": "recovery"
}
```


## Response Example
```json
{
	"status": "email_sent",
	"teacher_email": "ana.silva@school.com",
	"sent_at": "2025-10-23T13:15:00Z"
}
```

## Error Responses
| Code | Meaning                | Example                                    |
| ---- | ---------------------- | ------------------------------------------ |
| 400  | Missing required field | `{ "error": "teacher_email is required" }` |
| 500  | Email provider failure | `{ "error": "SMTP timeout" }`              |


## Setup
1. Clone the repo and install dependencies:
	```sh
	npm install
	```
2. Add your SendGrid API key to `.env`:
	```env
	SENDGRID_API_KEY=SG.xxxxxxxx
	```
3. Build and run locally:
	```sh
	npm run build
	func start
	```

## Deployment
Deploy as an Azure Function using Azure Functions Core Tools or the Azure Portal. For CI/CD, see `.github/workflows/nodejs.yml`.

## License
MIT
