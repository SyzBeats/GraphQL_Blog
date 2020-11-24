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

const db = { users, comments, posts };
export default db;
