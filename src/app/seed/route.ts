// import { db } from "@vercel/postgres";

// const client = await db.connect();

// const restaurants = [
// 	{
// 		id: "4f029370-c7c8-4a8f-b6a1-37423b303e7f",
// 		name: "Pasta Paradise",
// 		address: "123 Pasta Lane, Stockholm",
// 		cuisine: "Italian",
// 		rating: 4.7,
// 	},
// 	{
// 		id: "2b3f1e72-9b6e-4d0c-a99b-9804e5b92bdc",
// 		name: "Sushi World",
// 		address: "456 Sushi Avenue, Malmö",
// 		cuisine: "Japanese",
// 		rating: 4.5,
// 	},
// ];

// const users = [
// 	{
// 		id: "40a96177-dbf4-4bc1-bfb5-9851c3f85c37",
// 		name: "John Doe",
// 		email: "john.doe@example.com",
// 		address: "789 Elm Street, Gothenburg",
// 		phone: "0701234567",
// 	},
// 	{
// 		id: "f28f1d64-8391-4abf-aec6-c2782bd3c791",
// 		name: "Jane Smith",
// 		email: "jane.smith@example.com",
// 		address: "101 Maple Road, Uppsala",
// 		phone: "0737654321",
// 	},
// ];

// const menus = [
// 	{
// 		id: "1df78143-68b7-4f99-910e-741f76fd6de1",
// 		restaurant_id: "4f029370-c7c8-4a8f-b6a1-37423b303e7f",
// 		name: "Spaghetti Carbonara",
// 		price: 120,
// 	},
// 	{
// 		id: "9b3d5e3d-614e-4e53-90d1-d58001c5c0a5",
// 		restaurant_id: "4f029370-c7c8-4a8f-b6a1-37423b303e7f",
// 		name: "Margherita Pizza",
// 		price: 95,
// 	},
// 	{
// 		id: "6f0413e2-2e4f-437b-85a2-cb8e583a33d2",
// 		restaurant_id: "2b3f1e72-9b6e-4d0c-a99b-9804e5b92bdc",
// 		name: "Salmon Nigiri",
// 		price: 80,
// 	},
// 	{
// 		id: "e482cc75-e50f-4cf7-a6a5-afeed56cd7e9",
// 		restaurant_id: "2b3f1e72-9b6e-4d0c-a99b-9804e5b92bdc",
// 		name: "California Roll",
// 		price: 70,
// 	},
// ];

// const orders = [
// 	{
// 		id: "f42f5c7e-4e9d-4d35-a8b6-d709d7d8e02b",
// 		user_id: "40a96177-dbf4-4bc1-bfb5-9851c3f85c37",
// 		restaurant_id: "4f029370-c7c8-4a8f-b6a1-37423b303e7f",
// 		total: 240,
// 		status: "Delivered",
// 		items: [{ id: "1e733676-c9b8-48a2-9a70-6fbb946dfb6a", name: "Spaghetti Carbonara", quantity: 2, price: 120 }],
// 	},
// 	{
// 		id: "8c17b2cf-0af1-44df-9dfd-4c13e1533b14",
// 		user_id: "f28f1d64-8391-4abf-aec6-c2782bd3c791",
// 		restaurant_id: "2b3f1e72-9b6e-4d0c-a99b-9804e5b92bdc",
// 		total: 240,
// 		status: "In Progress",
// 		items: [{ id: "f61ec6b9-8bd3-4996-8a25-e8386d4869f3", name: "Salmon Nigiri", quantity: 3, price: 80 }],
// 	},
// ];

// async function seedRestaurants() {
// 	await client.sql`
//     CREATE TABLE IF NOT EXISTS restaurants (
//       id UUID PRIMARY KEY,
//       name TEXT UNIQUE NOT NULL,
//       address TEXT NOT NULL,
//       cuisine TEXT NOT NULL,
//       rating NUMERIC
//     );
//   `;

// 	const insertedRestaurants = await Promise.all(
// 		restaurants.map(
// 			(restaurant) => client.sql`
//         INSERT INTO restaurants (id, name, address, cuisine, rating)
//         VALUES (${restaurant.id}, ${restaurant.name}, ${restaurant.address}, ${restaurant.cuisine}, ${restaurant.rating})
//         ON CONFLICT (id) DO NOTHING;
//       `,
// 		),
// 	);

// 	return insertedRestaurants;
// }

// async function seedUsers() {
// 	await client.sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID PRIMARY KEY,
//       name TEXT NOT NULL,
//       email TEXT UNIQUE NOT NULL,
//       address TEXT,
//       phone TEXT
//     );
//   `;

// 	const insertedUsers = await Promise.all(
// 		users.map(
// 			(user) => client.sql`
//         INSERT INTO users (id, name, email, address, phone)
//         VALUES (${user.id}, ${user.name}, ${user.email}, ${user.address}, ${user.phone})
//         ON CONFLICT (id) DO NOTHING;
//       `,
// 		),
// 	);

// 	return insertedUsers;
// }

// async function seedMenus() {
// 	await client.sql`
//     CREATE TABLE IF NOT EXISTS menus (
//       id UUID PRIMARY KEY,
//       restaurant_id UUID REFERENCES restaurants(id),
//       name TEXT NOT NULL,
//       price NUMERIC NOT NULL
//     );
//   `;

// 	const insertedMenus = await Promise.all(
// 		menus.map(
// 			(menu) => client.sql`
//         INSERT INTO menus (id, restaurant_id, name, price)
//         VALUES (${menu.id}, ${menu.restaurant_id}, ${menu.name}, ${menu.price})
//         ON CONFLICT (id) DO NOTHING;
//       `,
// 		),
// 	);

// 	return insertedMenus;
// }

// async function seedOrders() {
// 	await client.sql`
//     CREATE TABLE IF NOT EXISTS orders (
//       id UUID PRIMARY KEY,
//       user_id UUID REFERENCES users(id),
//       restaurant_id UUID REFERENCES restaurants(id),
//       total NUMERIC NOT NULL,
//       status TEXT NOT NULL,
//       order_date TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS order_items (
//       id UUID PRIMARY KEY,
//       order_id UUID REFERENCES orders(id),
//       name TEXT NOT NULL,
//       quantity INTEGER NOT NULL,
//       price NUMERIC NOT NULL
//     );
//   `;

// 	const insertedOrders = await Promise.all(
// 		orders.map(async (order) => {
// 			await client.sql`
//         INSERT INTO orders (id, user_id, restaurant_id, total, status)
//         VALUES (${order.id}, ${order.user_id}, ${order.restaurant_id}, ${order.total}, ${order.status})
//         ON CONFLICT (id) DO NOTHING;
//       `;

// 			return Promise.all(
// 				order.items.map(
// 					(item) =>
// 						client.sql`
//             INSERT INTO order_items (id, order_id, name, quantity, price)
//             VALUES (${item.id}, ${order.id}, ${item.name}, ${item.quantity}, ${item.price})
//             ON CONFLICT (id) DO NOTHING;
//           `,
// 				),
// 			);
// 		}),
// 	);

// 	return insertedOrders;
// }

// export async function GET() {
// 	try {
// 		await client.sql`BEGIN`;

// 		await seedRestaurants();
// 		await seedUsers();
// 		await seedMenus();
// 		await seedOrders();

// 		await client.sql`COMMIT`;

// 		return Response.json({ message: "Database seeded successfully" });
// 	} catch (error) {
// 		await client.sql`ROLLBACK`;
// 		return Response.json({ error }, { status: 500 });
// 	}
// }
