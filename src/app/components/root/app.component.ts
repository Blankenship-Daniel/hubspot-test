import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { SchedulerService } from "../../services/scheduler";
import { CandidatesService } from "../../services/candidates";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "hubspot";
  candidates$: Observable<any>;
  candidates: any;
  schedule: any;

  constructor(
    private candidatesService: CandidatesService,
    private schedulerService: SchedulerService
  ) {
    this.candidates$ = this.candidatesService.getCandidates();
    this.candidates$.subscribe((candidates) => (this.candidates = candidates));
  }

  submitSchedule() {
    this.schedule = this.schedulerService.generateSchedule(this.candidates);
    this.candidatesService.submitSchedule(this.schedule).subscribe((res) => {
      console.log(res);
    });
  }
}
