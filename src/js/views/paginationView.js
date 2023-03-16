import icons from 'url:../../img/icons.svg';

class PaginationView {
    #data;
    #parentElement = document.querySelector('.pagination');
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
    #generateMarkup() {
        const numPages = Math.ceil(this.#data.results.length / this.#data.resultsPerPage);
        // console.log(numPages);
        if(this.#data.page === 1 && numPages > 1) {
            return `
                <button data-goto="${this.#data.page + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${this.#data.page + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        if(this.#data.page === numPages && numPages > 1) {
            return `
                <button data-goto="${this.#data.page - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${this.#data.page - 1}</span>
                </button>
            `;
        }
        if(this.#data.page < numPages) {
            return `
                <button data-goto="${this.#data.page - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${this.#data.page - 1}</span>
                </button>
                <button data-goto="${this.#data.page + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${this.#data.page + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        return `only 1 page`;
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
    addHandlerClick(handler) {
        this.#parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }
};

export default new PaginationView();