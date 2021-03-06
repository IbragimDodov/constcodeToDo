class Application {
  constructor(param) {
    const app = this;
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

    panelElement.querySelector('[data-button="archive"]').addEventListener('click',
      event =>  {
        for(let item of this.list) {
          if(item.selected) {
            item.archived = true;
            item.selected = false;
          }
        }

        this.update();
    })

    this.el.querySelector('input').addEventListener('keydown', function(event) {
      if (event.key !== 'Enter' || !this.value.trim()) {
        return
      }

      if (this.value === "Покажи все когда-либо бывшие задачи") {
        app.list.forEach(item => item.archived = false);
        this.value = '';
        app.update();
        return;
      }
      
      if (this.value === "Удали все когда-либо бывшие задачи") {
        app.list = this.items;
        this.value = '';
        app.update();
        return;
      }

      const id = Math.max(0, ...app.list.map(x => x.id)) + 1;

      app.list.push({
        id, content: this.value.trim(), selected: false, done: false, archived: false
      })
      
      app.list = app.list.sort((a,b) => b.id - a.id);

      app.update();
    })

    if (localStorage.getItem("__TODO__APPLICATION__")) {
      this.list = JSON.parse(localStorage.getItem("__TODO__APPLICATION__"));
    } else {
      this.list = []
    }

    // this.list = [
    //   { id: 5, content: 'Позвонить Маме', selected: false, done: true, archived: false },
    //   { id: 4, content: 'Покодить', selected: false, done: true, archived: false },
    //   { id: 3, content: 'Посмотреть JS', selected: false, done: false, archived: false },
    //   { id: 2, content: 'Помыть машину', selected: false, done: false, archived: false },
    //   { id: 1, content: 'Купить хлеб', selected: false, done: false, archived: false }
    // ];

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

    localStorage.setItem("__TODO__APPLICATION__", JSON.stringify(this.list));

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

