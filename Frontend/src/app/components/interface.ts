export interface CovidData {
  data: { [key: string]: Category };
}

export interface Category {
  confirmed: number;
  active:    number;
  recovered: number;
  deceased:  number;
}

export interface StateList {
  state:     string;
  stateCode: string;
}

