export interface BarData {
  label: string;
  image: string;
  color: string;
  values: number[];
}

export interface ParsedData {
  labels: string[];
  data: BarData[];
}