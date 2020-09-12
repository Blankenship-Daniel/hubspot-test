import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { SchedulerService } from "../../services/scheduler";
import { CandidatesService } from "../../services/candidates";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [CandidatesService, SchedulerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
