

# AKI Function – Envio de Email de Senha

## Visão Geral
Função Azure que envia e-mails de criação ou recuperação de senha para professores no sistema AKI.

## Funcionalidades
- Endpoint HTTP POST principal: `/api/email` (pode haver rota específica `password-setup`).
- Validação de payload com Zod.
- Suporta fluxos: criação (`setup`) e recuperação (`recovery`).
- Envio via SendGrid com lógica de retry.
- Logs estruturados para auditoria.
- Erros claros para validação e falhas do provedor de e-mail.

## Arquitetura (Resumo)
| Componente | Papel |
| ---------- | ----- |
| `src/index.ts` | Ponto de entrada: roteia requisições, chama serviço de envio. |
| `src/domain/` | Tipos e regras de negócio (modelo de email, validação semântica). |
| `src/infrastructure/` | Cliente SendGrid, implementação de retries/timeouts. |
| `src/interface/` | DTOs, schemas Zod, mapeamento de erros -> HTTP. |
| `src/shared/` | Logger, utilidades e config/env. |
| `.env.example` | Exemplo das variáveis obrigatórias. |

Fluxo: Request -> valida schema -> define template (setup/recovery) -> gera conteúdo (usa token/expiração) -> envia via SendGrid -> responde JSON.

## Dados Essenciais do Payload
| Campo | Descrição |
| ----- | --------- |
| `teacher_id` | (Opcional no recovery) Identificador do professor. |
| `teacher_email` | Email destino. |
| `teacher_name` | Nome para personalização (setup). |
| `token` | Token JWT ou hash para link de redefinição. |
| `expires_at` | ISO datetime de expiração do token. |
| `emailType` | `setup` ou `recovery`. |

## Exemplos
### Requisição (Setup)
```http
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

### Requisição (Recovery)
```http
POST /api/email
Content-Type: application/json

{
  "teacher_email": "ana.silva@school.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-10-24T00:00:00Z",
  "emailType": "recovery"
}
```

### Resposta
```json
{
  "status": "email_sent",
  "teacher_email": "ana.silva@school.com",
  "sent_at": "2025-10-23T13:15:00Z"
}
```

### Erros Comuns
| Código | Motivo | Exemplo |
| ------ | ------ | ------- |
| 400 | Campo ausente/inválido | `{ "error": "teacher_email is required" }` |
| 500 | Falha provedor | `{ "error": "SendGrid timeout" }` |

## Variáveis de Ambiente (Principais)
| Nome | Uso |
| ---- | --- |
| `SENDGRID_API_KEY` | Autenticação no SendGrid. |
| `LOG_LEVEL` | Nível de log. |
| `BASE_URL` (opcional) | Base para montar links nos emails. |
| `TOKEN_EXPIRATION_MINUTES` (opcional) | Override de expiração se aplicável. |

## Início Rápido
```bash
npm install
cp .env.example .env
# editar SENDGRID_API_KEY
npm run build
func start
```
Endpoint local: `http://localhost:7071/api/email`

## Observabilidade e Confiabilidade
- Logs estruturados (incluir correlação se disponível).
- Retry simples no envio (exponencial/backoff conforme implementação). 
- Possível extensão: fila de dead-letter ou fallback provider.

## Autores
Camila Delarosa  
Dimitri Delinski  
Guilherme Belo  
Yasmin Carmona

## Licença
MIT
