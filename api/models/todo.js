require('dotenv').config();
const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("db connected");
}
const todoSchema = new mongoose.Schema({
  taskId: Number,
  task: String,
});
exports.Todo = mongoose.model("Todo", todoSchema);


// uV4oWoNlEEsXbWms

//VKf7efMVRVx7riaF -- db password