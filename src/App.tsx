import "./App.css";
import { getTodos, type Todo } from "./test";
import { useState, useEffect } from "react";

type ToggleTodo = Omit<Todo, "text">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  useEffect(() => {
    getTodos().then((data) => setTodoList(data));
  }, []);

  const [text, setText] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleAddTodo = async () => {
    if (text === "") {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
    };
    await fetch("http://localhost:3001/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });

    setTodoList((prev) => [...prev, newTodo]);
    setText("");
  };

  const handleDeleteTodo = async (id: Todo["id"]) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    });

    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = async ({ id, completed }: ToggleTodo) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed,
      }),
    });
    setTodoList((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !completed,
          };
        }
        return todo;
      })
    );
  };

  return (
    <>
      <h1>Todo List</h1>
      <div>
        <input type="text" value={text} onChange={handleTitleChange} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <TodoList
        todoList={todoList}
        onDeleteClick={handleDeleteTodo}
        onToggleClick={handleToggleTodo}
      />
    </>
  );
}

type TodoListProps = {
  todoList: Todo[];
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListProps) {
  return (
    <div>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          onDeleteClick={onDeleteClick}
          onToggleClick={onToggleClick}
        />
      ))}
    </div>
  );
}
type TodoItemProps = Todo & {
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoItem({
  id,
  text,
  completed,
  onDeleteClick,
  onToggleClick,
}: TodoItemProps) {
  return (
    <ul>
      <li style={{ textDecoration: completed ? "none" : "line-through" }}>
        {text}
        <button onClick={() => onToggleClick({ id, completed })}>
          {completed === true ? "Complete" : "Undo"}
        </button>
        <button onClick={() => onDeleteClick(id)}>Delete</button>
      </li>
    </ul>
  );
}

export default App;
