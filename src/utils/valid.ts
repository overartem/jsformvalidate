import {
  COUPON_ERROR_FIELD_CLASS,
  COUPON_FIELD,
  COUPON_SUCCESS_FIELD_CLASS,
  GROUP_INPUT_SET_NAME,
  RULE_NAME_TOP_MSG,
  SINGLE_INPUT_NAME,
  TOP_NAME_MSG,
  VALIDATE_ERROR_FIELD_CLASS,
  VALIDATE_ERROR_LABEL_CLASS,
} from "../constants/form";
import { IErrorContainers, IStore, TElement } from "../types/plugin";

export function getCardFieldsetErrContainer(inputName: string | null): IErrorContainers {
  if (inputName === null) throw new Error(`Error containers not found for input name "${inputName}"`);
  const errorTopContainer = document.querySelector(`.validate-${inputName}-container-top`) as HTMLDivElement;
  const errorBottomContainer = document.querySelector(`.validate-container_${inputName}_bottom`) as HTMLDivElement;
  return { errorTopContainer, errorBottomContainer };
}

export function getGroupName(inputName: string): string {
  const groupItemName = getRegExpItems(inputName, GROUP_INPUT_SET_NAME);
  if (!groupItemName) throw new Error(`Group ItemName is undefined`);
  return groupItemName;
}

export function getRegExpItems(inputName: string, arr: string[]): string {
  const regex = new RegExp(inputName.split("-").join("|"), "i");
  const filteredInputName = arr.filter((item) => regex.test(item));
  return filteredInputName[0];
}

export function removeErrorFormMsg(): void {
  const focusedInputElement = document.activeElement as HTMLInputElement;
  const groupInputName = getRegExpItems(focusedInputElement.name, GROUP_INPUT_SET_NAME);
  const isSingleInput = SINGLE_INPUT_NAME.includes(focusedInputElement.name);
  const setName = groupInputName && !isSingleInput ? groupInputName : focusedInputElement.name;

  if (focusedInputElement.tagName !== "INPUT") return;
  focusedInputElement.classList.remove(VALIDATE_ERROR_FIELD_CLASS);

  const topErrorTag = document.querySelector(`.validate-${setName}-container-top .${VALIDATE_ERROR_LABEL_CLASS}`);
  const bottomErrorTag = document.querySelector(`.validate-container_${setName}_bottom .${VALIDATE_ERROR_LABEL_CLASS}`);

  if (!topErrorTag && !bottomErrorTag) return;
  topErrorTag ? topErrorTag?.remove() : bottomErrorTag?.remove();
}

export function setErrorStyles(
  element: HTMLInputElement | HTMLSelectElement,
  top: HTMLDivElement,
  bottom: HTMLDivElement,
  reverse: boolean,
  msg?: string | null
): void {
  element.classList.add(VALIDATE_ERROR_FIELD_CLASS);
  const errorLabelClass = `${VALIDATE_ERROR_LABEL_CLASS}`;

  if (reverse) {
    if (!msg) throw new Error(`Error label message is null or undefined`);
    bottom.innerHTML = `<p class="${errorLabelClass}">${msg}</p>`;
    if (top) top.querySelector(`.${errorLabelClass}`)?.remove();
  } else {
    top.innerHTML = `<p class="${errorLabelClass}">${TOP_NAME_MSG}</p>`;
    if (bottom) bottom.querySelector(`.${errorLabelClass}`)?.remove();
  }
}

export function errorReducer(element: TElement, inputName: string, rule: string, msg: string | null): void {
  const isSingleInput = SINGLE_INPUT_NAME.includes(inputName);
  const isTopRule = RULE_NAME_TOP_MSG.includes(rule);
  const groupName = isSingleInput ? null : getGroupName(inputName);
  const inputTagName = isSingleInput ? inputName : groupName ? groupName : null;
  const { errorTopContainer: top, errorBottomContainer: bottom } = getCardFieldsetErrContainer(inputTagName);
  setErrorStyles(element, top, bottom, !isTopRule, !isTopRule ? msg : null);
}

export function getCouponStatus(status: boolean) {
  const formElement = document.querySelector(COUPON_FIELD) as HTMLInputElement;
  if (!status && formElement.value !== "") formElement.value = "";
}

export function removeCouponStatus(addActiveWrapper: HTMLDivElement): void {
  setTimeout(() => {
    const hasFailedClass = addActiveWrapper.classList.contains(COUPON_ERROR_FIELD_CLASS);
    const hasAppliedClass = addActiveWrapper.classList.contains(COUPON_SUCCESS_FIELD_CLASS);
    if (hasFailedClass) {
      removeErrorFormMsg();
      addActiveWrapper?.classList.remove(COUPON_ERROR_FIELD_CLASS);
    } else if (hasAppliedClass) {
      removeErrorFormMsg();
      addActiveWrapper?.classList.remove(COUPON_SUCCESS_FIELD_CLASS);
    }
  }, 100);
}

export function checkCoupon(addActiveWrapper: HTMLDivElement, formElement: HTMLInputElement, Data: IStore): boolean {
  if (!addActiveWrapper && !formElement && !Data) throw new Error(`Error, arguments of the checkCoupon cannot be undefined`);
  addActiveWrapper?.classList.add("active");
  if (formElement.value === "") {
    errorReducer(formElement, formElement.name, "coupon", "Please enter a coupon code");
    return false;
  }
  const coupon = Data.coupons[formElement.value];

  formElement.addEventListener("input", () => {
    removeCouponStatus(addActiveWrapper);
  });

  if (coupon) {
    errorReducer(formElement, formElement.name, "coupon", "Your coupon has been applied");
    formElement.classList.remove(VALIDATE_ERROR_FIELD_CLASS);
    addActiveWrapper?.classList.add(COUPON_SUCCESS_FIELD_CLASS);
    return true;
  } else {
    errorReducer(formElement, formElement.name, "coupon", "Invalid coupon code :(");
    addActiveWrapper?.classList.add(COUPON_ERROR_FIELD_CLASS);
    return false;
  }
}

export async function sentForm(formData: FormData, formElement: HTMLFormElement): Promise<void> {
  const data: Record<string, string> = {};

  for (let [key, value] of formData.entries()) {
    data[key] = String(value);
  }
  const response = await fetch("/submit-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const data = await response.json();
    formElement.reset();
    console.log(data);
  } else {
    console.error(`Submit Error ${response.status}, ${response.statusText}`);
  }
}

export function handleResize(cb: () => void): void {
  if (window.matchMedia("(max-width: 767px)").matches) {
    cb();
  }
}
