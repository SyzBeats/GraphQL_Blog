import { ApolloError } from "apollo-server";
import { v4 as uuidv4 } from "uuid";

const Mutation = {
	createUser(parent, args, { db }, info) {
		try {
			const emailTaken = db.users.some(user => user.email === args.data.email);

			if (emailTaken) {
				throw new ApolloError("This email exists");
			}

			const newUser = {
				id: uuidv4(),
				...args.data,
			};

			db.users.push(newUser);
			return newUser;
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	updateUser(parent, args, { db }, info) {
		try {
			const { id, data } = args;
			const user = db.users.find(user => user.id === id);

			if (!user) {
				throw new ApolloError("This user does not exist");
			}

			if (typeof data.email === "string") {
				const emailTaken = db.users.some(user => user.email === data.email);

				if (emailTaken) {
					throw new Error("This email is taken");
				}

				user.email = data.email;
			}

			if (typeof data.name === "string") {
				user.name = data.name;
			}

			if (typeof data.age !== "undefined") {
				user.age = data.age;
			}

			return user;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	deleteUser(parent, args, { db }, info) {
		try {
			const userIndex = db.users.findIndex(user => user.id === args.id);

			if (userIndex === -1) {
				throw new ApolloError("This user does not exist");
			}

			const deletedUsers = db.users.splice(userIndex, 1);

			/**
			 * @description delete all posts that are associated with a user.
			 * as we delete posts, we also have to delete the comments that refer these posts
			 * which will be done by checking additionally in a callback function
			 */
			db.posts = db.posts.filter(post => {
				const match = post.author === args.id;

				if (match) {
					db.comments = db.comments.filter(comment => comment.post !== post.id);
				}

				// just return posts that are not written by the user in args.id
				return !match;
			});

			db.comments = db.comments.filter(comment => comment.author !== args.id);

			return deletedUsers[0];
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	createPost(parent, args, { db, pubSub }, info) {
		try {
			const userExists = db.users.some(user => user.id === args.data.author);
			if (!userExists) {
				throw new ApolloError("User not found");
			}

			const post = {
				id: uuidv4(),
				...args.data,
			};

			db.posts.push(post);

			// subscription
			if (args.data.published) {
				pubSub.publish("post", { post });
			}

			return post;
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	updatePost(parent, args, { db }, info) {
		try {
			const { data, id } = args;
			const post = db.posts.find(post => post.id === id);

			if (!post) {
				throw new ApolloError("this post does not exist");
			}

			if (typeof data.title === "string") {
				post.title = data.title;
			}

			if (typeof data.body === "string") {
				post.body = data.body;
			}

			return post;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	deletePost(parent, args, { db }, info) {
		try {
			const postIndex = db.posts.findIndex(post => post.id === args.id);

			if (postIndex === -1) {
				throw new ApolloError("This post does not exist");
			}

			const deleted = db.posts.splice(postIndex, 1);

			// delet related comments

			db.comments = db.comments.filter(comment => comment.post !== args.id);

			return deleted[0];
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	createComment(parent, args, { db, pubSub }, info) {
		try {
			const { post, author, text } = args.data;

			const userExists = db.users.some(user => user.id === author);

			if (!userExists) {
				throw new ApolloError("The user does not exist");
			}
			const postExists = db.posts.some(currentPost => currentPost.id === post);

			if (!postExists) {
				throw new ApolloError("The post does not exist");
			}
			const newComment = {
				id: uuidv4(),
				...args.data,
			};

			db.comments.push(newComment);

			// to enable socket communication once a new comment is created on a post
			pubSub.publish(`comment ${args.data.post}`, { comment: newComment });

			return newComment;
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	updateComment(parent, args, { db }, info) {
		try {
			const { id, data } = args;
			const comment = db.comments.find(comment => comment.id === id);

			if (!comment) {
				throw new ApolloError("This user does not exist");
			}

			if (typeof data.text === "string") {
				comment.text = data.text;
			}

			return comment;
		} catch (error) {
			console.log(error);
			return error;
		}
	},

	deleteComment(parent, args, { db }, info) {
		try {
			const commentIndex = db.comments.findIndex(
				comment => comment.id === args.id
			);

			if (!commentIndex === -1) {
				return new ApolloError("This comment does not exist");
			}

			const deleted = db.comments.splice(commentIndex, 1);

			return deleted[0];
		} catch (error) {
			console.log(error);
			return error;
		}
	},
};

export { Mutation };
