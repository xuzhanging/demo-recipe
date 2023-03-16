import { API_URL, RES_PER_PAGE} from "./config";
import { getJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    }
};

export const loadRecipe = async function(id) {
    try {
        // const res = await fetch(`${API_URL}/${id}`);
        // const data = await res.json();
        // if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        const data = await getJSON(`${API_URL}/${id}`);
        const {recipe} = data.data;
        state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients
        }
        // console.log(state.recipe);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        // console.log(data);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url
            }
        })
        
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE;
    return state.search.results.slice(start, end);
};

export const updataServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}