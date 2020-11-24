const Post = {
	/**
	 * @description as author is a subtype of post, we can access the parent (Post) and its
	 * properties to determine the ID
	 */
	author(parent, args, { db }, info) {
		return db.users.find(user => user.id === parent.author);
	},
	comments(parent, args, { db }, info) {
		return db.comments.filter(comment => comment.post === parent.id);
	},
};

export { Post };
