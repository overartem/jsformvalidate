import { MobileNav } from "../modules/mobile-nav";
import { Accordion } from "../modules/accordion";
import { FormValidator } from "../modules/form-validator";
import { handleResize } from "../utils/valid";

export class App {
  init() {
    new FormValidator(".checkout-form");
    new Accordion(".payment-companies-tab", ".payment-companies-block").init();
    new Accordion(".coupon-link").init();
    this.forMobile();
  }

  forMobile() {
    const footerNavClass = ".footer-navigations .nav-item:not(.exclude) h3";
    handleResize(() => MobileNav(".mobile-menu"), footerNavClass);
  }
}
