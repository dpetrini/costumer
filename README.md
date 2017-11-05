# costumer
General costumer handling with Express. Server side for react-costumer SPA.

## Technical Stack
* Language - JavaScript/NodeJS, Express, bcrypt, Mongojs/MongoDB

## Architecture
The application isserver side for React app dpetrini/react-costumer
The source files are divided in folders inside js/source directory as follows:
* config: files to hold environment variables like which mogo db server to use
* controllers: the C of MVC, holds the logic to interface react client app to database
* db: holds the connection to mongo db
* middleware: custom express middleware
* models: M of MVC, holds real connection to db and other server related functions.
* public: file that holds the react client app when in production
* routes: express routes for this app
* tests: unit and api tests, mocha based (not complete yet)
* views: temporaty pug views for data handling in server


## API

### POST /users/loginclient
Login entry point.

#### Request

| Body Param    | Description |
|----------|-------------|
| email    | User email as ID       |
| password | User password    |

### GET /users/logoutclient
Logout entry point.

#### Response
| HTTP       | Value     |
|------------|-----------|
| Body       | { "OK"} |

### POST /costumers
Create costumer entry in database.

#### Request

| Body Param    | Description |
|----------|-------------|
| firstName    | First name       |
| lastName | Last name    |
| contactNumber | Phone number    |
| email | Email address    |

#### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| Body       | { "_id", "firstName", "lastName", "contactNumber", "email"} |

### GET /costumers
Sends all costumers content.

#### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------|
| Body       | { "_id", "firstName", "lastName", "contactNumber", "email"} |

## Environment Variables
Before testing or running the service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
process.env.NODE_ENV | `production` or `development` or `test` | Defines the API entry points for testing or production.
MONGODB_USER | `mongo user` | user to run the database.
MONGODB_PASSWD | `mongo password` | passoword for user to run the database.
DEBUG | `users:*` | Use to enable debug messages.

Obs. For tests please set up local mongo db and user blank values for the above.


## Tests

```
Mocha, instanbul, converage
To run: 
npm test-api
npm test-html

(not complete yet)
```

## How to Run

Download this repository. And export the above environment variables, then make sure to open react app.

Using npm:
```
$ npm install
$ npm start
```

Open in your browser
```
http://localhost:3000 
```

## Missing Features
* Clean pug temporary templates
* Create support for proposals database, and other missing CRUD operations for current ones

