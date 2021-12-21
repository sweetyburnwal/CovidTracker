import { Component, OnInit } from '@angular/core';
import {TrackerService} from "../../services/tracker.service";
import {CovidData, StateList} from "../interface";

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class TrackerComponent implements OnInit {

  public covidList: CovidData | null = null;
  public stateList: StateList[] | null = null;

  constructor(
    private trackerService : TrackerService,
    ) { }

  ngOnInit(): void {
    this.getCovidDataList();
  }

  getCovidDataList(): void {
    this.trackerService.getCovidData().subscribe((result) => {
      console.log(result);
      this.covidList = result.data;
    });
  }

  getStateDataList(): void {
    this.trackerService.getStateList().subscribe((result) => {
      console.log(result);
      this.stateList = result.data;
    });
  }

}
