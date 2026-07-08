# Property Manager - Architecture Guide

## Goal

Property Manager is a full-stack business application for managing customers, properties, bookings and payments.

## Tech Stack

### Backend

- Java
- Spring Boot
- Maven
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 for development
- PostgreSQL later

### Frontend

- Angular
- PrimeNG
- ngx-translate
- SCSS

## Backend Structure

```text
com.srki.backend
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
└── service

Backend Rules
Controllers expose REST endpoints.
Services contain business logic.
Repositories access the database.
Entities represent database tables.
DTOs are used for API input/output.
JPA entities are not returned directly to the frontend.
Validation is done with Bean Validation annotations.
Constructor injection is preferred.
Frontend Structure
src/app
├── core
├── features
├── layout
└── shared
Feature Structure

Each feature should follow this structure:

features/customers
├── components
├── models
├── services
└── pages
Frontend Rules
Components display data and handle user interaction.
Services call REST APIs.
Models define TypeScript interfaces.
Text displayed to users must use i18n.
Avoid hardcoded labels in templates.
i18n Rules

Translations are stored in:

public/assets/i18n/en.json
public/assets/i18n/el.json

Use namespaces:

{
  "APP": {
    "TITLE": "Property Manager"
  },
  "CUSTOMERS": {
    "TITLE": "Customers",
    "FIRST_NAME": "First name"
  },
  "COMMON": {
    "EMAIL": "Email",
    "PHONE": "Phone"
  }
}

Use in templates:

{{ 'CUSTOMERS.TITLE' | translate }}
{{ 'COMMON.EMAIL' | translate }}
Git Workflow
Work in small steps.
Commit after each completed feature.
Use clear commit messages.
Push with Sync Changes after commit.

Good commit examples:

Add health endpoint
Configure Angular proxy
Add i18n support
Add customer REST API
Display customers in Angular

Avoid vague messages:

fix
test
changes
Build Commands
Backend compile
cd backend
./mvnw clean compile
Backend run
cd backend
./mvnw spring-boot:run
Frontend install
cd frontend
npm install
Frontend run
cd frontend
npx ng serve --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.json

## 3. Κάνε commit

```bash
git add docs/architecture.md
git commit -m "Add architecture guide"
git push

ή από Source Control:

Stage → Commit → Sync Changes