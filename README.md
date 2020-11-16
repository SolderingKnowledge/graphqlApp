1 `npm init -y`

2 `npm install --save express express-graphql graphql lodash`

3 `node app.js` to run the server

4 `localhost:4000/graphiql` will be tool(graphiQL) available

5 `npm i --save json-server` install package that (serves dummy json data)[https://github.com/typicode/json-server]

6 `npm i --save axios`

7 `npm i --save nodemon`

```js
//GraphQL query => request for user with id=23 and fields of that user: [id, firstName, age]
{
    user(id : "23"){
        id,
        firstName,
        age
    }
}

//response:
{
  "data": {
    "user": {
      "id": "23",
      "firstName": "Bill",
      "age": 20
    }
  }
}
```

```json

//http://localhost:3000/users/23 => { id: "23", firstName: "Bill", age: 20 }
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json:server": "json-server --watch db.json"//to run json-server package in watch mode
  },
```