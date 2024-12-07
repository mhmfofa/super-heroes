import { ChartTypeEnum } from "../enums";

export interface ChartDataModel {
  type: ChartTypeEnum;
  labels: string[];
  dataset: {
    label: string;
    data: number[];
  }
}