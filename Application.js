class Application {
  constructor(param) {
    this.el = param.el;

    this.el.innerHTML = '';
    this.el.append(this.getBasicDOM());

    this.list = [
      { id: 1, content: 'Купить хлеб', selected: true, done: false },
      { id: 2, content: 'Помыть машину', selected: true, done: false },
      { id: 3, content: 'Посмотреть JS', selected: false, done: false },
      { id: 4, content: 'Покодить', selected: false, done: true },
      { id: 5, content: 'Позвонить Маме', selected: false, done: true }
    ];

    this.update()
  }

  update() {
    const app = this;
    const ulElement = this.el.querySelector('[data-items]');
    ulElement.innerHTML = '';

    for (const item of this.list) {
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
            item.done = !item.done;
            app.update();
          } else if (action === 'done') {
            
          }

        }
        else {
          item.selected = !item.selected;
          app.update();
        }
      })
    }
  }

  getItemDOM (item) {
    const ulElement = document.createElement('div');
    ulElement.innerHTML = `
      <li class="list-group-item">
        <div class="d-flex w-100 justify-content between">
          <span>${item.content}</span>
          <div class="btn-group" role="group">
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
                <div class="btn-group">
                  <button type="button" disabled class="btn btn-danger">Архив</button>
                  <button type="button" disabled class="btn btn-success">Сделано</button>
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

