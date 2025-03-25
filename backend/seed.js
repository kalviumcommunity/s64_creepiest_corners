const User = require('./models/user');
const Post = require('./Post'); // Adjust the path as necessary
const { sequelize } = require('./database/database'); // Correctly import the sequelize instance


const seedDatabase = async () => {
    await sequelize.sync({ force: true }); // Clear the database and create tables

    // Create users
    const user1 = await User.create({ username: 'user1', email: 'user1@example.com', password: 'password1' });
    const user2 = await User.create({ username: 'user2', email: 'user2@example.com', password: 'password2' });
    const user3 = await User.create({ username: 'user3', email: 'user3@example.com', password: 'password3' });

    // Create posts
    await Post.create({ title: 'Post by User 1', content: 'Content of post 1', created_by: user1.id });
    await Post.create({ title: 'Post by User 2', content: 'Content of post 2', created_by: user2.id });
    await Post.create({ title: 'Post by User 3', content: 'Content of post 3', created_by: user3.id });

    console.log('Database seeded successfully!');
};

seedDatabase()
    .catch(err => console.error('Error seeding database:', err))
    .finally(() => sequelize.close());
