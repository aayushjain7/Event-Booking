const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv').config();

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(isAuth);

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true,
	})
);

mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(5000);
		console.log('MONGODB and Server Connected!');
	})
	.catch((err) => {
		console.log(err);
	});
