import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{

  aTasks:Task[]=[]; // array vacio
  filteredTasks:Task[]=[]; // array vacio
  idCounter:string = '1';
  editTaskId:string | null = null
  pendingTasks:number = 0;


  constructor(private route:ActivatedRoute){}

  ngOnInit(): void {
    this.loadTasksFromLocalStorage();
    this.filterTasks();
    this.updatePendingTasks()
  }

  addTaskToList(task:string){
    const taskData = {
      id: this.idCounter,
      title: task,
      completed: false
    }
    let intCounter = parseInt(this.idCounter)
    intCounter++;
    this.idCounter = intCounter.toString();
    
    this.aTasks.push(taskData)
    this.updatePendingTasks()
    this.saveTasksOnLocalStorage();
  }

  toggleCompleted(task:Task){
    task.completed = !task.completed;
    this.updatePendingTasks()
    this.saveTasksOnLocalStorage();
  }

  deleteTask(taskId:string){
    const index = this.aTasks.findIndex(task => task.id == taskId)
    if (index != -1){
      this.aTasks.splice(index,1);
    }
    this.updatePendingTasks()
    this.saveTasksOnLocalStorage();
  }

  editTask(task:Task){
    this.editTaskId = task.id
    //setTimeOut para confirmar que carga el DOM
    setTimeout(() => {
      const inputElement = document.querySelector(`#edit-input-${task.id}`) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();  // Poner el foco en el input
      }
    }, 0);
    this.saveTasksOnLocalStorage();
  }

  updateTask(task:Task, event:KeyboardEvent){    
    if(event.key === 'Enter'){
      const inputElement = document.querySelector(`#edit-input-${task.id}`) as HTMLInputElement;
      task.title = inputElement.value.trim();
      this.editTaskId = null;
      this.saveTasksOnLocalStorage();
    } else if (event.key === 'Escape'){
      this.editTaskId = null;
    }
  }

  updatePendingTasks(){
    this.pendingTasks = this.aTasks.filter(task => !task.completed).length
  }

  clearedTasks(updatedTasks:Task[]){
    this.aTasks = updatedTasks
    this.filteredTasks = updatedTasks
    this.updatePendingTasks();
    this.saveTasksOnLocalStorage();
  }

  private saveTasksOnLocalStorage(){
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.aTasks))
  }
  private loadTasksFromLocalStorage(){
    const storedTasks = localStorage.getItem('mydayapp-angular')
    if (storedTasks){
      this.aTasks = JSON.parse(storedTasks)
      this.idCounter = this.aTasks.length > 0 ? String(Math.max(...this.aTasks.map(task => parseInt(task.id))) + 1) : '1'
    }
  }

  filterTasks(){
    const currentRoute = this.route.snapshot.routeConfig?.path;
    switch (currentRoute) {
      case 'pending':
        this.filteredTasks = this.aTasks.filter(task => !task.completed)
        break;
      case 'completed':
        this.filteredTasks = this.aTasks.filter(task => task.completed)
        break;
      default:
        this.filteredTasks = this.aTasks;
        break;
    }
  }

}
