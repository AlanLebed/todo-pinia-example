import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ITodo } from '@/interfaces';
import { updateData, deleteData } from '@/service/service';

function toggleProp(prop: 'important' | 'done', id: string, todo: ITodo) {
  return todo.id === id ? { ...todo, [prop]: !todo[prop] } : todo;
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<ITodo[]>([]);

  function addTodo(todo: ITodo) {
    todos.value.push(todo);
  }

  function removeTodo(id: string) {
    try {
      deleteData(id);    
    } catch (error) {
      console.log("Error deleting todo");
    }; 

    todos.value = todos.value.filter((todo: ITodo) => todo.id !== id);
  }

  function toggleDone(id: string) {    
    try {
      const data = {id: id, option: "done"};
      updateData(data);    
    } catch (error) {
      console.log("Error updating todo");
    };
   
    todos.value = todos.value.map((todo) => toggleProp('done', id, todo));
  }

  function toggleImportant(id: string) {
    try {
      const data = {id: id, option: "important"};
      updateData(data);    
    } catch (error) {
      console.log("Error updating todo");
    };

    todos.value = todos.value.map((todo) => toggleProp('important', id, todo));
  }

  const doneTodosCount = computed(() => todos.value.filter((todo) => todo.done).length);
  const importantTodosCount = computed(() => todos.value.filter((todo) => todo.important).length);
  const activeTodosCount = computed(() => todos.value.filter((todo) => !todo.done).length);

  return {
    addTodo,
    removeTodo,
    toggleDone,
    toggleImportant,
    doneTodosCount,
    importantTodosCount,
    activeTodosCount,
    todos
  };
});
