/*----------------------------------------------
 Load eventual search parameters from the url
 and parse them into parameters fit for the API
----------------------------------------------*/
let searchType = getUrlProperties(location.search).type || 'characters';
let searchString = getUrlProperties(location.search).search || '';
searchString = searchString ? 
  (searchType == 'comics' || searchType == 'series') ? 
    `titleStartsWith=${searchString}&` : 
    `nameStartsWith=${searchString}&` : 
  '';

/*------------------------------------
 Load data, initialize content holder
 with data and add infinite scroll
------------------------------------*/ 
let comicsData;
let comicsArray = [];
let state = {};
$(() => {
  $.get(`https://gateway.marvel.com:443/v1/public/${searchType}?${searchString}apikey=${apiKey}`, result => {
    state[searchType] = result.data.results;
    $('.content-holder').append(`<h2>${searchType}</h2>
      <div class="card-container" id="${searchType}" style="height:auto"></div>`
    );
    updateHolder(searchType, 0);
    $('.spinner').remove();
    addInfiniteScroll(getMoreComics);
  });
});

/*--------------------------------
 Function for getting more comics
--------------------------------*/
const getMoreComics = () => {
  const offset = state[searchType].length;
  $('body').append('<div class="spinner"/>');
  $.get(`https://gateway.marvel.com:443/v1/public/${searchType}?${searchString}offset=${offset}&apikey=${apiKey}`, comics => {
    state[searchType] = state[searchType].concat(comics.data.results);
    updateHolder(searchType, offset);
    $('.spinner').remove();
    addInfiniteScroll(getMoreComics);
  });
};