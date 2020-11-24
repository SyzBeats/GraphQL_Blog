import { gql, ApolloServer, ApolloError } from "apollo-server";
import { v4 as uuidv4 } from "uuid";
// Scalar types - String, Boolean, Int, Float, ID

// Schemas

const users = [
	{
		id: "1",
		name: "Simeon",
		email: "simeon@mail.com",
		age: 27,
	},
	{
		id: "2",
		name: "noemis",
		email: "noemis@mail.com",
		age: 22,
	},
	{
		id: "3",
		name: "Lilia",
		email: "lili@mail.com",
		age: 33,
	},
];

const posts = [
	{
		id: "1",
		title: "What is graphql",
		body: "<h2>it is a query language</h2>",
		published: true,
		author: "1",
	},
	{
		id: "2",
		title: "Node.js is awesome",
		body: "<h3>API development</h3>",
		published: true,
		author: "2",
	},
	{
		id: "3",
		title: "Node.js is awesome",
		body: "<h3>API development</h3>",
		published: true,
		author: "3",
	},
];

const comments = [
	{
		id: "1",
		text: "So ein unsinn",
		post: "1",
		author: "1",
	},
	{
		id: "2",
		text: "Ach, da kommen Erinnerungen hoch",
		post: "1",
		author: "1",
	},
	{
		id: "3",
		text: "Lorem ipsum ist nicht kreativ",
		post: "2",
		author: "2",
	},
	{
		id: "4",
		text: "Jokes aside - du hast sie nicht mehr alle",
		post: "3",
		author: "2",
	},
];

const typeDefs = `
    type Query {
		users(query:String): [User!]!
		posts(query:String): [Post!]!
		me: User!
		post: Post!
		comments: [Comment!]!
	}

	type Mutation {
		createUser(name:String!, email: String!, age: Int):User!
		createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
		createComment(text: String!, post: ID!, author: ID): Comment!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
	} 

	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}

	type Comment {
		id: ID!
		text: String!
		post: Post!
		author: User!
	}
`;

// Resolvers

const resolvers = {
	Query: {
		me(parent, args, ctx, info) {
			return {
				id: "u123456",
				name: "simeon",
				email: "simeon@web.de",
				age: 27,
			};
		},
		post(parent, args, ctx, info) {
			return {
				id: "p123456",
				title: "Post 1",
				body: "<h1>test</h1>",
				published: true,
			};
		},
		users(parent, args, ctx, info) {
			if (!args.query) return users;
			const searchString = args.query.toLowerCase();
			return users.filter(
				val => val.name.toLowerCase().indexOf(searchString) !== -1
			);
		},
		posts(parent, args, ctx, info) {
			if (!args.query) return posts;
			const searchString = args.query.toLowerCase();
			return posts.filter(post => {
				const titleMatch =
					post.title.toLowerCase().indexOf(searchString) !== -1;
				const bodyMatch = post.body.toLowerCase().indexOf(searchString) !== -1;
				return titleMatch || bodyMatch;
			});
		},
		comments() {
			return comments;
		},
	},

	Mutation: {
		createUser(parent, args, ctx, info) {
			try {
				const emailTaken = users.some(user => user.email === args.email);

				if (emailTaken) {
					throw new ApolloError("This email exists");
				}

				const { name, email, age } = args;
				const newUser = {
					id: uuidv4(),
					name,
					email,
					age,
				};

				users.push(newUser);
				return newUser;
			} catch (error) {
				console.log(error);
				return error;
			}
		},

		createPost(parent, args, ctx, info) {
			try {
				const userExists = users.some(user => user.id === args.author);
				if (!userExists) {
					throw new ApolloError("User not found");
				}

				const { title, body, published, author } = args;

				const post = {
					id: uuidv4(),
					title,
					body,
					published,
					author,
				};

				posts.push(post);
				return post;
			} catch (error) {
				console.log(error);
				return error;
			}
		},

		createComment(parent, args, ctx, info) {
			try {
				const { post, author, text } = args;

				const userExists = users.some(user => user.id === author);

				if (!userExists) {
					throw new ApolloError("The user does not exist");
				}
				console.log();
				const postExists = posts.some(currentPost => currentPost.id === post);

				if (!postExists) {
					throw new ApolloError("The post does not exist");
				}
				const newComment = {
					id: uuidv4(),
					text,
					author,
					post,
				};
				comments.push(newComment);
				return newComment;
			} catch (error) {
				console.log(error);
				return error;
			}
		},
	},

	Post: {
		/**
		 * @description as author is a subtype of post, we can access the parent (Post) and its
		 * properties to determine the ID
		 */
		author(parent, args, ctx, info) {
			return users.find(user => user.id === parent.author);
		},
		comments(parent, args, ctx, info) {
			return comments.filter(comment => comment.post === parent.id);
		},
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter(post => post.author === parent.id);
		},
		comments(parent, args, ctx, info) {
			return comments.filter(comment => comment.author === parent.id);
		},
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find(user => user.id === parent.author);
		},
		post(parent, args, ctx, info) {
			return posts.find(post => post.id === parent.post);
		},
	},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
