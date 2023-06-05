export class Accordion {
  private $el: NodeListOf<HTMLElement>;
  private $parentClass: string | null;
  private $eventHandlers: Map<Element, (event: Event) => void>;

  constructor(selector: string, parent?: string) {
    const element: NodeListOf<HTMLElement> = document.querySelectorAll(selector);

    if (element === null) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    this.$el = element;
    this.$parentClass = parent ? parent : null;
    this.$eventHandlers = new Map();
  }

  init(): void {
    this.$el.forEach((el: HTMLElement) => {
      const $parent = this.$parentClass ? el.closest(this.$parentClass) : null;
      const $dropdown = el.nextElementSibling as HTMLElement;
      if ($parent) $parent.classList.toggle("active");
      $dropdown ? ($dropdown.style.maxHeight = "0") : console.error(`Dropdown element not found`);
      const handleEvent = (event: Event) => {
        event.preventDefault();
        el.classList.toggle("active");
        const maxHeight = el.classList.contains("active") ? $dropdown.scrollHeight + "px" : "0";
        $dropdown.style.maxHeight = maxHeight;
      };

      el.addEventListener("click", handleEvent);
      this.$eventHandlers.set(el, handleEvent);
    });
  }

  destroy(): void {
    this.$el.forEach((el: HTMLElement) => {
      const handleEvent = this.$eventHandlers.get(el);
      if (handleEvent) {
        el.removeEventListener("click", handleEvent);
        this.$eventHandlers.delete(el);
        const $dropdown = el.nextElementSibling as HTMLElement;
        el.classList.remove("active");
        if ($dropdown) $dropdown.style.maxHeight = "none";
      }
    });
  }
}
