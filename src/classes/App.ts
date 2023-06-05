import { MobileNav } from "../modules/mobile-nav";
import { Accordion } from "../modules/accordion";
import { FormValidator } from "../modules/form-validator";
 import { handleResize } from "../utils/valid";

export class App {
  init() {
    new FormValidator(".checkout-form");
    new Accordion(".payment-companies-tab").init();
    new Accordion(".coupon-link").init();
    this.forMobile();
  }

  forMobile() {
    const init = handleResize(() => {
      MobileNav(".mobile-menu");
    });
    window.addEventListener("resize", () => init);
  }
}
