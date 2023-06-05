import { MobileNav } from "../modules/mobile-nav";
import { Accordion } from "../modules/accordion";
import { FormValidator } from "../modules/form-validator";

export class App {
  init() {
    new FormValidator(".checkout-form");
    new Accordion(".payment-companies-tab");
    new Accordion(".coupon-link");
    MobileNav(".mobile-menu");
  }
}
