export interface IErrorContainers {
  errorTopContainer: HTMLDivElement;
  errorBottomContainer: HTMLDivElement;
}

export type TElement = HTMLInputElement | HTMLSelectElement;

export interface IStore {
  coupons: Coupons;
}

export interface Coupons {
  [key: string]: Coupon;
}

export interface Coupon {
  id: number;
  name: string;
  value: string;
}
