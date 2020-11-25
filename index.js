import { gql, ApolloServer, ApolloError, PubSub } from "apollo-server";
import fs from "fs";
import db from "./src/db";
import {
	Query,
	Post,
	User,
	Comment,
	Mutation,
	Subscription,
} from "./src/resolvers";

const pubSub = new PubSub();
const resolvers = {
	Query,
	Mutation,
	Subscription,
	Post,
	User,
	Comment,
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs: gql`
		${fs.readFileSync(__dirname.concat("/src/schema.graphql"), "utf-8")}
	`,
	resolvers,
	context: {
		db,
		pubSub,
	},
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
