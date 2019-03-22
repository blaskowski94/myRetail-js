# myRetail RESTful Service

myRetail is a rapidly growing company with HQ in Richmond, VA and over 200 stores across the 
east coast. myRetail came to me with the desire to make its internal data available to client devices,
 from myRetail.com to native mobile apps.
 
The goal for this project was to create an end-to-end Proof-of-Concept for a products API, 
which will aggregate product data from multiple sources and return it as JSON to the caller. 

This express application exposes full CRUD opperations for myRetail's data. Price information for myRetail's products is 
stored in a NoSQL Mongo database. The API can be used to create new database entries, list all entries in database, 
update a specific entry, delete a specific entry or get an entry with price information and a product name retrieved from another api.

### Prerequisites

* [node](https://nodejs.org/en/download/) >= 10
* [npm](https://www.npmjs.com/get-npm) >= 6

### Installing

Clone the project repository, navigate to folder, install dependencies

```
git clone https://github.com/blaskowski94/myRetail-js.git
cd myRetail-js
npm install
```

### Getting started

```
USER={user} PASSWORD={password} npm start
```

Starts a server at `http://localhost:3000`. The username and password are used for the database connection. Contact project owner for database credentials.

To start the server in development mode (hot reloading after code changes):
```
USER={user} PASSWORD={password} npm run start-dev
```

### Routes

* `GET /products` - list all products in database
* `POST /products` - create new product in database
* `GET /products/{id}` - get a specific product with name from redsky api and price from database
* `PUT /products/{id}` - update product's price in database, upsert if not exist
* `DELETE /products/{id}` - delete a specific product from the database

See the swagger at [http://localhost:3000/api](http://localhost:3000/api) for more detail.

### Running the tests

```
npm run test
```

For test coverage:

```
npm run test-coverage
```

### Coding style tests

Code linting using eslint for style consistency

```
npm run lint
```

### Built With

* [node](https://nodejs.org/) - a JavaScript runtime
* [npm](https://www.npmjs.com/) - package management
* [express](https://expressjs.com/) - node web framework
* [mongoDb](https://www.mongodb.com/) - NoSQL database

### Authors

* **Bob Laskowski** - [blaskowski94](https://github.com/blaskowski94)

### License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
