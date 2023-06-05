import { Validator, enLang as en } from "@upjs/facile-validator";
import ValidDate from "./valid-date";
import { TElement, IStore } from "../types/plugin";
import { errorReducer, removeErrorFormMsg, checkCoupon, getCouponStatus, sentForm } from "../utils/valid";
import DataCoupons from "../data/coupons.json";
import { COUPON_FIELD } from "../constants/form";

export class FormValidator {
  private element: string;
  private isValidDate: boolean;
  private isValidCoupon: boolean;

  constructor(selector: string) {
    if (!!!selector) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    this.element = selector;
    this.isValidDate = false;
    this.isValidCoupon = false;
    this.init();
  }

  init() {
    const formElement = document.querySelector(this.element) as HTMLFormElement;
    const validator = new Validator(formElement, {
      lang: en,
      onFieldChangeValidation: true,
      onFieldChangeValidationDelay: 100,
      renderErrors: false,
      xRules: {
        date: /^((0[1-9])|(1[0-2]))\/((2023)|(20[0-9][0-9]))$/,
      },
    });

    validator.on("field:error", (_form, _field, errors) => {
      errors.forEach((error) => {
        this.setErrorMsg(error.element, error.rule);
      });
    });

    validator.on("validation:end", (form, isSuccessful) => {
      if (isSuccessful) {
        removeErrorFormMsg();
        const inputDate = form.querySelector("#card-date") as HTMLInputElement;
        this.isDateValid(inputDate);
      }
    });

    this.couponValidate();
    this.validAndSend(formElement, validator);
  }

  setErrorMsg(element: TElement, rule: string): void {
    let msg = null;
    switch (element.name) {
      case "email":
        msg = "Your email is incomplete";
        errorReducer(element, element.name, rule, msg);
        break;
      case "card":
        msg = "Your card number is invalid";
        errorReducer(element, element.name, rule, msg);
        break;
      case "card-date":
        msg = "Your card's expiration date is incomplete (MM/YYYY)";
        errorReducer(element, element.name, rule, msg);
        break;
      case "card-cvv":
        msg = "Your cvv is incomplete";
        errorReducer(element, element.name, rule, msg);
        break;
      case "card-name":
        errorReducer(element, element.name, rule, msg);
        break;
    }
  }

  isDateValid(input: HTMLInputElement | HTMLSelectElement): boolean {
    if (input.value.length <= 6) {
      return (this.isValidDate = false);
    }
    const getDate = ValidDate(() => ({
      format: "MM/yyyy",
      isAfter: new Date(),
    }));
    const isValid = getDate(input.value, input);
    if (isValid) {
      return (this.isValidDate = true);
    } else {
      errorReducer(input, input.name, "date", "Your card's expiration year is in the past");
      return (this.isValidDate = false);
    }
  }

  couponValidate() {
    const formElement = document.querySelector(COUPON_FIELD) as HTMLInputElement;
    const applyLink = document.querySelector(".coupon-apply") as HTMLLinkElement;
    const removeLink = document.querySelector(".coupon-remove") as HTMLLinkElement;
    const Data: IStore = DataCoupons;
    const addActiveWrapper = formElement.closest(".coupon-form-dropdown") as HTMLDivElement;

    applyLink
      ? applyLink.addEventListener("click", () => {
          this.isValidCoupon = checkCoupon(addActiveWrapper, formElement, Data);
        })
      : console.error("Coupon apply button not found");

    removeLink
      ? removeLink.addEventListener("click", () => {
          formElement.value = "";
          formElement.focus();
          removeErrorFormMsg();
          addActiveWrapper?.classList.remove("coupon-failed");
        })
      : console.error("Coupon remove button not found");
  }

  validAndSend(formElement: HTMLFormElement, validator: Validator) {
    formElement.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      getCouponStatus(this.isValidCoupon);
      const formIsValid = validator.validate();
      const formData: FormData = new FormData(formElement);
      if (formIsValid && this.isValidDate) {
        sentForm(formData, formElement);
      } else {
        console.error("ERROR, FORM IS NOT VALID");
      }
    });
  }
}
