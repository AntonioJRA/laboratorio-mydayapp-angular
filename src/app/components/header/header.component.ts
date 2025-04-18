import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() addTask = new EventEmitter<string>();
  newTask:string='';

  emitTask() {
    if(this.newTask.trim()){
      this.addTask.emit(this.newTask);
      this.newTask=''
    }
  }
}
