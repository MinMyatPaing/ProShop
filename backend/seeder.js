import dotenv from "dotenv";

import User from "./models/user.js";
import Product from "./models/product.js";
import Order from "./models/order.js";
import users from "./data/users.js";
import products from "./data/products.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const productsData = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(productsData);

    console.log("Data sucessfully imported!");
    process.exit();
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log("Data sucessfully destroyed!");
    process.exit();
  } catch (error) {
    console.log("Error: ", error);
    process.exit(1);
  }
};

if(process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
