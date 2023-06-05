export class Accordion {
  private $el: HTMLElement;
  private $dropdown: HTMLElement;
  private $toggleHandler: EventListenerOrEventListenerObject;

  constructor(selector: string) {
    const element = document.querySelector(selector);

    if (element === null) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    this.$el = element as HTMLElement;
    this.$dropdown = this.$el.nextElementSibling as HTMLElement;
    this.$toggleHandler = this.toggle.bind(this);
  }

  init(): void {
    this.$el.addEventListener("click", this.$toggleHandler);
  }

  toggle(e: Event): void {
    e.preventDefault();
    this.$el.classList.toggle("active");
    const maxHeight = this.$el.classList.contains("active") ? this.$dropdown.scrollHeight + "px" : "0";
    this.$dropdown.style.maxHeight = maxHeight;
  }
}
