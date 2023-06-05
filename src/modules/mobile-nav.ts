export function MobileNav(element:string) {
  window.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector<HTMLLinkElement>(element);

    burger?.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Not Today Bro!");
    });
  });
}
