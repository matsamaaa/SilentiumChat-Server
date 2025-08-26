# SilentiumChat Server

🚧 **Work in Progress** 🚧

SilentiumChat Server is the backend component for **SilentiumChat**, a secure messaging app with **end-to-end encryption (E2EE)**.  
The server only relays encrypted messages between clients and never has access to users' private keys or unencrypted data.

## Features (planned)

- Relay encrypted messages between clients
- Store minimal metadata (message IDs, timestamps) if needed
- Handle file uploads and downloads securely
- Future: WebSocket support, group chat relay, notifications, etc.

## Status

> [!CAUTION]
> This project is still under active development.  
> Expect frequent updates, changes, and new features.

## Configuration

Before running the server, make sure to configure the following:  

- The **port** the server should listen on
- Database connection details (if applicable)

> Example (in a `.env` file):
```env
URL_MONGO_INTERNAL="URL_HERE (ex: mongodb://USERNAME:PASSWORD@DOMAIN_NAME/?authMechanism=DEFAULT&authSource=admin&dbName=DATABASE_NAME)"
PORT=30001
```

## Contributing

Ideas, feedback, and contributions are welcome!  
Please refer to the [Client repository](https://github.com/matsamaaa/SilentiumChat-Client) for the front component.
