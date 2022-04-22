class Application {
  constructor(param) {
    this.el = param.el;

    this.el.innerHTML = '';
    this.el.append(this.getBasicDOM());

    const panelElement = this.el.querySelector('[data-panel]');
    panelElement.querySelector('[data-button="done"]').addEventListener('click',
      event =>  {
        for(let item of this.list) {
          if(item.selected) {
            item.done = !item.done;
            item.selected = false;
          }
        }

        this.update();
    })


    this.list = [
      { id: 1, content: 'Купить хлеб', selected: true, done: false, archived: false },
      { id: 2, content: 'Помыть машину', selected: true, done: false, archived: false },
      { id: 3, content: 'Посмотреть JS', selected: false, done: false, archived: false },
      { id: 4, content: 'Покодить', selected: false, done: true, archived: false },
      { id: 5, content: 'Позвонить Маме', selected: false, done: true, archived: false }
    ];

    this.update()
  }

  get someSelected () {
    return this.items.some(item => item.selected);
  }

  get items () {
    return this.list.filter(item => !item.archived);
  }

  update() {
    const app = this;
    const ulElement = this.el.querySelector('[data-items]');
    ulElement.innerHTML = '';

    for (const item of this.items) {


      const liElement = this.getItemDOM(item);
      ulElement.append(liElement);

      if (item.selected) {
        liElement.classList.add('active');
      }

      if (item.done) {
        liElement.querySelector('span').classList.add('item-done');
      }

      liElement.addEventListener('click', function (event) {

        if (event.target.tagName === 'BUTTON') {
          const action = event.target.getAttribute('data-button');

          if (action === 'archive') {
            item.archived = true;
            app.update();
          } else if (action === 'done') {
            item.done = !item.done;
            app.update();
          }

        }
        else {
          item.selected = !item.selected;
          app.update();
        }
      })
    }

    const panelElement = this.el.querySelector('[data-panel]');
    const buttonElements = panelElement.querySelectorAll('[data-button]');

    buttonElements.forEach(item => item.removeAttribute('disabled'));
    if(!this.someSelected) {
      buttonElements.forEach(item => item.setAttribute('disabled', true));
    }
  }

  getItemDOM (item) {
    const ulElement = document.createElement('div');
    ulElement.innerHTML = `
      <li class="list-group-item">
        <div class="list-group-items-wrapper">
          <span>${item.content}</span>
          <div class="btn-group" role="group" ${this.someSelected ? "style ='visibility:hidden'" : ''}>
            <button type="button" class="btn btn-danger" data-button="archive">Архив</button>
            <button type="button" class="btn btn-success" data-button="done">Сделано</button>
          </div>
        </div>
      </li>
    `
    return ulElement.firstElementChild;
  }

  getBasicDOM () {
    const divElement = document.createElement('div');
    divElement.innerHTML= `
      <div class="container">
        <div class="card" style="max-width: 700px; margin: 10px auto;">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <div class="d-flex">
                <input type="text" class="form-control" placeholder="something will todo"/>
                <div class="btn-group" data-panel>
                  <button type="button" class="btn btn-danger" data-button="archive">Архив</button>
                  <button type="button" class="btn btn-success" data-button="done">Сделано</button>
                </div>
              </div>
            </li>
          </ul>
          <ul class="list-group list-group-flush" data-items></ul>
        </div>
      </div>
    `
    return divElement.firstElementChild;
  }
}

