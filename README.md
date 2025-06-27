# Health Benefix API

## Project Description

This is a RESTful API developed in Node.js with TypeScript for managing health plan beneficiaries and their respective documents.

## Features

-   Register a beneficiary with their documents.
-   List all registered beneficiaries.
-   List all documents for a specific beneficiary.
-   Update a beneficiary's registration data.
-   Remove a beneficiary and their documents.

## Entities

### Beneficiary

| Property  | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| id        | `string` | Unique identifier for the beneficiary |
| name      | `string` | Beneficiary's full name               |
| phone     | `string` | Contact phone number                  |
| birthDate | `Date`   | Beneficiary's date of birth           |
| createdAt | `Date`   | System created date (automatic)       |
| updateAt  | `Date`   | Last update date (automatic)          |

### Document

| Property     | Type     | Description                                |
| ------------ | -------- | ------------------------------------------ |
| id           | `string` | Unique identifier for the document         |
| documentType | `string` | E.g., ID Card, SSN, Driver's License, etc. |
| description  | `string` | Description or number of the document      |
| createdAt    | `Date`   | System created date (automatic)            |
| updateAt     | `Date`   | Last update date (automatic)               |

## Technologies

-   Node.js (>=22.0.0)
-   TypeScript
-   TSX
-   Vitest
-   BiomeJS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Node.js (version `>=22.0.0`)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Nunes-ND/health_benefix_api.git
    cd health_benefix_api
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the project (Development)
### Available Scripts

```bash
-   `npm run dev`: Starts the application in development mode with watch mode.
-   `npm run build`: Compiles the TypeScript code for production.
-   `npm start`: Runs the application in production mode (requires a previous build).
-   `npm test`: Runs the test suite once.
-   `npm run test:watch`: Runs the tests in watch mode.
-   `npm run check`: Runs the linter and formatter (Biome) to ensure code quality and standards.
