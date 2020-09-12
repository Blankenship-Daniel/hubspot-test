import { ScheduleEntry } from "./ScheduleEntry";

export type Schedule = {
  [countries: string]: ScheduleEntry[];
};
