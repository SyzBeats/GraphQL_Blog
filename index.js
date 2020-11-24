import { gql, ApolloServer, ApolloError } from "apollo-server";
import fs from "fs";
import db from "./src/db";
import { Query, Post, User, Comment, Mutation } from "./src/resolvers";

const resolvers = {
	Query,
	Mutation,
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
	},
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
