# Test Automation with Playwright/JavaScript Czechitas course

## Initial setup
First make user you have Node.js 22 installed. 

If you use NVM (recommended), tun the following command to set correct version of Node.js:
```
nvm use
```

Then install the dependencies:
```
npm install
```

## Setup environment variables
Create a `.env` file in the root of the project and add the following variables:
```
BASE_URL=https://example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```
Change the values to match your environment.

## Running tests

**Run tests in interactive mode (recommended):**
```
npx playwright test --ui
```

**Run tests in headless mode:**
```
npx playwright test
```

**Generate a report:**
```
npx playwright show-report
```

## Update playwright
```
npx playwright install 
```