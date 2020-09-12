import { Injectable } from "@angular/core";
import { Partner } from "../../types/Partner";
import { CandidateResponse } from "../../types/CandidateResponse";
import { CountryMap } from "../../types/CountryMap";
import { DateMap } from "../../types/DateMap";
import { CommonPartnerMap } from "../../types/CommonPartnerMap";
import { Schedule } from "../../types/Schedule";

@Injectable({
  providedIn: "root",
})
export class SchedulerService {
  constructor() {}

  generateSchedule(candidates: CandidateResponse) {
    const map = this.buildCountryMap(candidates);
    const scheduleMap = this.buildScheduleMap(map);
    const schedule = this.buildSchedule(scheduleMap);
    return schedule;
  }

  private buildCountryMap(candidates: CandidateResponse): CountryMap {
    const countryMap = {};
    candidates.partners.forEach((partner: Partner) => {
      partner.availableDates.forEach((date: string) => {
        this.addPartner(countryMap, date, partner);
      });
    });
    return countryMap;
  }

  private addPartner(map: CountryMap, date: string, partner: Partner) {
    if (map[partner.country]) {
      if (map[partner.country][date]) {
        map[partner.country][date].push(partner);
      } else {
        map[partner.country][date] = [partner];
      }
    } else {
      map[partner.country] = {
        [date]: [partner],
      };
    }
  }

  /**
   * Filters the CountryMap and returns a CountryMap with only consecutive
   * start dates.
   * @param map
   */
  private buildScheduleMap(map: CountryMap): CountryMap {
    const countries = Object.keys(map);
    const scheduleMap = {};

    countries.forEach((country) => {
      const dates = Object.keys(map[country]).sort();
      let i = 0;
      let j = 1;
      for (; j < dates.length; i++, j++) {
        const date1 = dates[i];
        const date2 = dates[j];

        if (this.isConsecutiveDate(date1, date2)) {
          const partners = this.findCommonPartners(date1, date2, map[country]);
          scheduleMap[country] = {
            ...scheduleMap[country],
            [date1]: partners,
          };
        }
      }
    });

    return scheduleMap;
  }

  /**
   * Finds Partners that are in both dates.
   * @param date1
   * @param date2
   * @param map
   */
  private findCommonPartners(
    date1: string,
    date2: string,
    map: DateMap
  ): string[] {
    const partners = [...map[date1], ...map[date2]];
    const commonPartnerMap: CommonPartnerMap = {};
    partners.forEach((partner) => {
      commonPartnerMap[partner.email] = commonPartnerMap[partner.email]
        ? ++commonPartnerMap[partner.email]
        : 1;
    });
    const commonPartners = [];
    Object.keys(commonPartnerMap).forEach((email) => {
      if (commonPartnerMap[email] > 1) {
        commonPartners.push(email);
      }
    });
    return commonPartners;
  }

  private isConsecutiveDate(date1: string, date2: string): boolean {
    return Date.parse(date2) - Date.parse(date1) === 86400000;
  }

  /**
   * Transforms the CountryMap into what the API is expecting.
   * @param map
   */
  private buildSchedule(map: CountryMap): Schedule {
    const countries = Object.keys(map);
    const scheduleMap = {
      countries: [],
    };
    countries.forEach((country) => {
      const startDates = Object.keys(map[country]).sort();
      let currMaxStartDate = null;
      let currDateEmails = [];
      startDates.forEach((date) => {
        if (map[country][date].length > currDateEmails.length) {
          currDateEmails = map[country][date];
          currMaxStartDate = date;
        }
      });
      scheduleMap.countries.push({
        attendeeCount: currDateEmails.length,
        attendees: currDateEmails,
        name: country,
        startDate: currMaxStartDate,
      });
    });
    return scheduleMap;
  }
}
