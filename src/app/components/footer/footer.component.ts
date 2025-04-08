import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  @Input() pendingTasks: number = 0;
  @Input() aTasks: Task[] = [];
  @Output() clearedTasks: EventEmitter<Task[]> = new EventEmitter();

  constructor(private router: Router) {}

  deleteCompletedTasks() {
    const updatedTasks = this.aTasks.filter((task) => !task.completed);
    this.clearedTasks.emit(updatedTasks);
  }

  isThereTaskCompleted(): boolean {
    let areCompletedTasks = false;
    this.aTasks.forEach((task) => {
      if (task.completed) areCompletedTasks = true;
    });
    return areCompletedTasks;
  }

  getLinkClass(paths: string[]): string {
    const currentUrl = this.router.url;
    console.log(currentUrl);
    return paths.includes(currentUrl) ? 'selected' : '';
  }
}
