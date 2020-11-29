const Query = {
	/**
	 * @param {object} parent
	 * @param {args} args passed arguments
	 * @param {object} context
	 * @param {object} info request information pipe
	 */
	me(parent, args, { db }, info) {
		return {
			id: "u123456",
			name: "simeon",
			email: "simeon@web.de",
			age: 27,
		};
	},
	/**
	 * @param {object} parent
	 * @param {args} args passed arguments
	 * @param {object} context
	 * @param {object} info request information pipe
	 */
	post(parent, args, { db }, info) {
		return {
			id: "p123456",
			title: "Post 1",
			body: "<h1>test</h1>",
			published: true,
		};
	},
	/**
	 * @param {object} parent
	 * @param {args} args passed arguments
	 * @param {object} context
	 * @param {object} info request information pipe
	 */
	users(parent, args, { db }, info) {
		if (!args.query) return db.users;
		const searchString = args.query.toLowerCase();
		return db.users.filter(
			val => val.name.toLowerCase().indexOf(searchString) !== -1
		);
	},
	/**
	 * @param {object} parent
	 * @param {args} args passed arguments
	 * @param {object} context
	 * @param {object} info request information pipe
	 */
	posts(parent, args, { db }, info) {
		if (!args.query) return db.posts;
		const searchString = args.query.toLowerCase();
		return db.posts.filter(post => {
			const titleMatch =
				db.post.title.toLowerCase().indexOf(searchString) !== -1;
			const bodyMatch = post.body.toLowerCase().indexOf(searchString) !== -1;
			return titleMatch || bodyMatch;
		});
	},
	comments() {
		return db.comments;
	},
};

export { Query };
