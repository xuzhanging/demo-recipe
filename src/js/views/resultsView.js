import icons from 'url:../../img/icons.svg';

class ResultsView {
    #parentElement = document.querySelector('.results');
    #data;
    #errorMessage = 'We could not find that recipe. Please try another one!';
    #message = '';
    render(data) {
        if(!data || Array.isArray(data) && data.length === 0) return this.renderError();
        this.#data = data;
        const markup = this.#generateMarkup();
        this.#clear();
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    #clear() {
        this.#parentElement.innerHTML = '';
    }
    addHandlerRender(handler) {
      ['load', 'hashchange'].forEach(e => window.addEventListener(e, handler));
    }
    #generateMarkup() {
        // console.log(this.#data);
        return this.#data.map(item => {
            return `
            <li class="preview">
                <a class="preview__link preview__link--active" href="#${item.id}">
                <figure class="preview__fig">
                    <img crossorigin="anonymous" src="${item.image}" alt="${item.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${item.title}</h4>
                    <p class="preview__publisher">${item.publisher}</p>
                </div>
                </a>
            </li>
            `;
        }).join('');
    }
    renderSpinner() {
        const markup = `
            <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
            </div>
        `;
        this.#parentElement.innerHTML = '';
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    };
    renderError(message = this.#errorMessage) {
      const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
      this.#clear();
      this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    renderMessage(message = this.#message) {
      const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
      this.#clear();
      this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }
};

export default new ResultsView();