/**
 * collection of all subscriptions
 * as the return value will always be >> subscription.propertyname <<
 * we return in the form of "return subscription.post"
 * so the resolver can handle the return value properly
 *
 * otherwise: "cannot return null for non-nullable field Subscription.propertyname"
 */
const Subscription = {
	comment: {
		/**
		 * @description setup the comment subscription using the publish subscribe (pubsub) whenever a new comment is
		 * published on a post
		 * @param {object} parent
		 * @param {object} args destructured arguments
		 * @param {object} ctx destructured context
		 * @param {object} info resolver information chain
		 */
		subscribe(parent, { postId }, { db, pubSub }, info) {
			try {
				const post = db.posts.find(
					post => post.id === postId && post.published === true
				);

				if (!post) {
					throw new Error(`Post with id ${postId} does not exist`);
				}

				// sets the channel ID
				return pubSub.asyncIterator(`comment ${postId}`);
			} catch (error) {
				console.log(error);
				return error;
			}
		},
	},
	post: {
		/**
		 * @description setup the post subscription using the publish subscribe (pubsub) whenever a new post is
		 * published
		 * @param {object} parent
		 * @param {object} args destructured arguments
		 * @param {object} ctx destructured context
		 * @param {object} info resolver information chain
		 */
		subscribe(parent, args, { db, pubSub }, info) {
			try {
				return pubSub.asyncIterator(`post`);
			} catch (error) {
				console.log(error);
				return error;
			}
		},
	},
};

export { Subscription };
