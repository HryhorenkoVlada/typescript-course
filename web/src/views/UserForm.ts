import { User } from "../models/User";

export class UserForm {

  constructor(public parent: Element, public model: User) { }

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:button': this.onButtonClick,
      'mouseenter:h1': this.onHeaderHover
    }
  }

  onHeaderHover(): void {
    console.log('h1 was hovered')
  }

  onButtonClick(): void {
    console.log('Hi there')
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();
    for (let evenetKey in eventsMap) {
      const [eventName, selector] = evenetKey.split(':')
      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, eventsMap[evenetKey]);
      })

    }
  }

  template(): string {
    return `
      <div>
        <h1>User form</h1>
        <div>${this.model.get("age")}</div>
        <input />
        <button>Click!</button>
      </div>
    `
  }

  render(): void {
    const templateElement = document.createElement('template')
    templateElement.innerHTML = this.template()
    this.bindEvents(templateElement.content)
    this.parent.append(templateElement.content)
  }

}