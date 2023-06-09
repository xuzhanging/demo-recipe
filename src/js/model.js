import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY} from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: []
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
        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
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
        state.search.page = 1;
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
};

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    state.bookmarks.push(recipe);
    state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
}

export const uploadRecipe = async function(newRecipe) {
    // console.log(newRecipe);
    const ingredients = Object.entries(newRecipe).filter(item => item[0].startsWith('ingredient') && item[1] !== '').map(ing => {
        const [quantity, unit, description] = ing[1].replaceAll(' ', '').split(',');
        return {quantity: quantity ? +quantity : null, unit, description};
    });
    console.log(ingredients);
    const new_Recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients
    }
    // console.log(recipe);
    const data = await sendJSON(`${API_URL}?key=${KEY}`, new_Recipe);
    console.log(data);
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
    };
    console.log(state.recipe);
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);