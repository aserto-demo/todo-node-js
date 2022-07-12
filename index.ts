import { Todo } from "./interfaces";
import express = require("express");
import cors = require("cors");
import { getUserByUserID } from "./directory";
import { initDb, getTodos, insertTodo, updateTodo, deleteTodo } from "./store";
import { UserCache, User } from "./interfaces";

const app: express.Application = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

//Users cache
const users: UserCache = {};

app.get("/user/:userID", async (req, res) => {
  const { userID } = req.params;
  const user: User = users[userID]
    ? users[userID]
    : await getUserByUserID(userID);

  //Fill cache
  users[userID] = user;
  res.json(user);
});

app.get("/todos", async (req, res) => {
  try {
    const todos: Todo[] = await getTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/todo", async (req, res) => {
  const todo: Todo = req.body;
  try {
    await insertTodo(todo);
    res.json({ msg: "Todo created" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/todo/:ownerID", async (req, res) => {
  const todo: Todo = req.body;
  try {
    await updateTodo(todo);
    res.json({ msg: "Todo updated" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/todo/:ownerID", async (req, res) => {
  const todo: Todo = req.body;
  try {
    deleteTodo(todo);
    res.json({ msg: "Todo deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
});
