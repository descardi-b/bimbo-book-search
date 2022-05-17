const express = require('express');
const path = require('path');

// import apollo server
const { ApolloServer } = require('apollo-server-express');

// import auth middleware
const {authMiddleware} = require('./utils/auth');

// db connection 
const db = require('./config/connection');

// const routes = require('./routes');

// express server
const app = express();
const PORT = process.env.PORT || 3001;

// apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// apply apollo server with express
server.applyMiddleware({ app });

// middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
