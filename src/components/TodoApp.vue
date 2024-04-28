<template>
  <!-- I added a button to provide users with an alternative method for adding Todos. 
  This ensures that users have a clear option available in case they do not realize that
  they need to press 'Enter' to submit their tasks. --->
  <div class="input-group">
    <Input
      v-model:value="field"
      class="input"
      @keyup.enter="handleAddTodo"
      placeholder="Type name of todo"
    />
    <button @click="handleAddTodo">ADD</button>
  </div>

  <!-- I integrated an external component for handling the required date functionality specified in the project requirements. 
  This component addresses all issues related to date management, such as ensuring the date is valid and correctly formatted. 
  For more information about the component, visit its website at: https://vue3datepicker.com/. -->
  <div>
    Deadline: 
    <VueDatePicker v-model="deadline" :hide-input-icon="true" :enable-time-picker="false" :format="format" auto-apply></VueDatePicker>
  </div>
  <!-- I modified the counters because I believe they represent important data for the user. 
  I aimed to enhance and center their visibility to ensure they are more prominent and easily noticeable.-->
  <div class="counters-group">
    <Typography>Done: {{ store.doneTodosCount }}</Typography> 
    <Typography>Important: {{ store.importantTodosCount }}</Typography>
    <Typography>Active: {{ store.activeTodosCount }}</Typography>
  </div>
  <List bordered :data-source="store.todos">
    <template #renderItem="{ item }">
      <ListItem>
        <div>
          <CheckOutlined class="icon" @click="store.toggleDone(item.id)" title="Toggle done" />
          <ExclamationOutlined
            color="red"
            @click="store.toggleImportant(item.id)"
            title="Toggle important"
          />
        </div>
        <!-- I made adjustments to the interface to improve legibility for users. 
        More importantly, these changes ensure that if the name of a todo is too lengthy, 
        it doesn't overflow the designated margins. -->
        <Typography :class="{ 'line-through': item.done, 'text-bold': item.important, 'list-item-text': item.text }">
        {{format2(item.deadline)}} --- {{item.text}}
        </Typography>
        <CloseCircleOutlined @click="store.removeTodo(item.id)"
      /></ListItem>
    </template>
  </List>
</template>

<script setup lang="ts">
import { Input, List, ListItem, Typography } from 'ant-design-vue';
import { ref } from 'vue';
import { useTodoStore } from '@/stores/todo';
import { v4 as uuidv4 } from 'uuid';
import CloseCircleOutlined from '@ant-design/icons-vue/lib/icons/CloseCircleOutlined';
import CheckOutlined from '@ant-design/icons-vue/lib/icons/CheckOutlined';
import ExclamationOutlined from '@ant-design/icons-vue/lib/icons/ExclamationOutlined';
import { addData, getData } from '@/service/service';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


const field = ref('');
const deadline = ref(new Date());
const store = useTodoStore();

if (store.todos.length === 0) getTodos();

const format = (deadline: Date) => {
  if (!deadline) return '';

  const day = deadline.getDate();
  const month = deadline.getMonth() + 1;
  const year = deadline.getFullYear();

  return `${day}/${month}/${year}`;
};

function format2 (deadline: Date){
  if (!deadline) return '';

  const deadline_format = new Date(deadline);
  const day = deadline_format.getDate();
  const month = deadline_format.getMonth() + 1;
  const year = deadline_format.getFullYear();

  return `${day}/${month}/${year}`;
}

async function getTodos() {
  try {
    const todos = await getData();
      
    if (todos.length > 0) {
      for(var todo in todos){
        let todoDB = {text: todos[todo].text, id: todos[todo].id, done: todos[todo].done, important: todos[todo].important, deadline: todos[todo].deadline}; 
        store.addTodo(todoDB);        
      }
    }
  } catch (error) {
    console.error('Error getting todos:', error);
  }
}


function createTodo(text: string, deadline: Date) {
  return {text, id: uuidv4(), done: false, important: false, deadline: deadline};
}

function handleAddTodo() {
  const todo = createTodo(field.value, deadline.value);
  store.addTodo(todo);

  field.value = '';
  
  try {
    const data = {text: todo.text, id: todo.id, done: todo.done, important: todo.done, deadline: todo.deadline.toLocaleDateString()};
    addData(data);    
  } catch (error) {
    console.log("Error saving todo");
 }; 
}
</script>

<style scoped>
.input {
  margin: 15px 0;
  flex-grow: 1;
  margin-right: 8px;
}
.icon {
  margin-right: 10px;
}
.line-through {
  text-decoration: line-through;
}
.text-bold {
  font-weight: 700;
}

.input-group {
  display: flex;        
  align-items: center;  
}

.counters-group {
  display: flex;        
  text-align: center;
  padding: 2%;
  font-size: 18px;
  justify-content: space-evenly;
}

button {
  flex-shrink: 0;       
  background-color: #1890ff; 
  color: white;              
  border: none;              
  text-align: center;        
  text-decoration: none;     
  display: inline-block;     
  font-size: 16px;           
  transition: 0.3s;          
  cursor: pointer;           
  border-radius: 10px;       
  box-shadow: 0 4px #999;   
  width: 65px;
  height: 35px;
}

button:hover {
  background-color: #45a049; 
  box-shadow: 0 6px #666;    
  transform: translateY(-2px); 
}

button:active {
  background-color: #3e8e41; 
  box-shadow: 0 2px #666;   
  transform: translateY(2px); 
}

.list-item-text {
  float: left; 
  max-width: 500px;
  word-wrap: break-word;
  text-indent: 20px;
}
</style>
