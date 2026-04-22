# LiftingCast Overlay Starter App build with React + TypeScript + Vite

## Getting started

Install node version from .nvmrc file.
Recommend using nvm. (https://github.com/nvm-sh/nvm).

```
nvm install
nvm use
```

Copy .env.sample to .env

```
cp .env.sample .env
```

Fill in your api key, meet id, and meet password.

Install dependencies

```
npm install
```

Run development server with hot reloading.

```
npm run dev
```

Edit graphics as needed.

## Hosting

You can run this app on the same system that you run your steaming capture software. Using the following command when running a meet as it will have better performance.

```
npm run start
```

### Docker

If you prefer not to install Node, you can run the app using Docker. Only Docker needs to be installed on the host PC.

Install Docker Desktop from https://www.docker.com/products/docker-desktop.

Copy .env.sample to .env and fill in your credentials as described above.

Build and start the app:

```
docker compose up
```

The app will be available at http://localhost:4001.

To stop the app press `Ctrl+C`, or run:

```
docker compose down
```

To rebuild after making changes to the source code:

```
docker compose up --build
```

> Note: On a fresh clone `docker compose up` is sufficient — Docker builds the image automatically if it doesn't exist yet.

If you host this app online it is recommended that access to load the app is secured in some way. Your LiftingCast API key and meet password will be available in the source code and could be stolen from you. It is your responsibility to keep your LiftingCast API key secure.

### Clock

Warning on using the clock. Inconsistent network latency may make it inaccurate. There is an latency adjustment in the Clock.tsx file.
