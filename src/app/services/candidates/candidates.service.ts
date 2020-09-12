import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Schedule } from "src/app/types/Schedule";

@Injectable({ providedIn: "root" })
export class CandidatesService {
  constructor(private httpClient: HttpClient) {}

  getCandidates(): Observable<Object> {
    return this.httpClient.get(
      `${environment.apiEndpoint}/dataset?userKey=${environment.apiKey}`
    );
  }

  submitSchedule(schedule: Schedule): Observable<any> {
    return this.httpClient.post(
      `${environment.apiEndpoint}/result?userKey=${environment.apiKey}`,
      schedule
    );
  }
}
