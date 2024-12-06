export type Todo = {
  id: number | string;
  text: string;
  completed: boolean;
};

export async function getTodos() {
  const res = await fetch("http://localhost:3001/todos");
  const data: Todo[] = await res.json();

  return data;
}

getTodos().then(console.log);
