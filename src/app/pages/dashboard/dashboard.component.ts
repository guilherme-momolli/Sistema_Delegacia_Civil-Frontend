import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard/dashboard.service';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{
  
}