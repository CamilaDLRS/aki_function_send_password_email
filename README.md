
# aki_function_send_password_email

## Overview
This Azure Function sends password setup emails to teachers when they are created without a password in the AKI system.

## Features
- HTTP POST endpoint: `/api/email/password-setup`
- Validates request payload using Zod
- Sends email via SendGrid (with retry logic)
- Logs all operations for audit
- Returns clear error responses for validation and provider failures

## Request Example
```json
POST /api/email/password-setup
Content-Type: application/json

{
	"teacher_id": 45,
	"teacher_email": "ana.silva@school.com",
	"teacher_name": "Ana Silva",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"expires_at": "2025-10-24T00:00:00Z"
}
```

## Response Example
```json
{
	"status": "email_sent",
	"teacher_id": 45,
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
