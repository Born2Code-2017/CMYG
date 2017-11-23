import { Component, OnInit } from '@angular/core';
import { ManagerDBModule } from '../shared/_services/dbManager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
