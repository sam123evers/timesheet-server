const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js')

const port = 4000;
const app = express();

app.use('/graphql', expressGraphQL({
	schema: schema,
	graphiql: true
}));

app.use('/', (req, res) => {
	res.json('go to /graphql')
});


app.listen(port, () => {
	console.log('listening on port ' + port)
})