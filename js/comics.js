let searchType = getUrlProperties(location.search).type || 'characters';
let searchString = getUrlProperties(location.search).search || '';
searchString = searchString ? 
  (searchType == 'comics' || searchType == 'series') ? 
    `titleStartsWith=${searchString}&` : 
    `nameStartsWith=${searchString}&` : 
  '';
let comicsData;
let comicsArray = [];
let state = {};
$.get(`https://gateway.marvel.com:443/v1/public/${searchType}?${searchString}apikey=${apiKey}`, result => {
  state[searchType] = result.data.results;
  $('.content-holder').append(`<h2>${searchType}</h2>a
     <div class="card-container" id="${searchType}" style="height:auto"></div>`
  );
  updateHolder(searchType, 0);
  $('.spinner').remove();
  addInfiniteScroll(getMoreComics);
});

const getMoreComics = () => {
  const offset = state[searchType].length;
  $('body').append('<div class="spinner" />');
  $.get(`https://gateway.marvel.com:443/v1/public/${searchType}?${searchString}offset=${offset}&apikey=${apiKey}`, comics => {
    state[searchType] = state[searchType].concat(comics.data.results);
    updateHolder(searchType, offset);
    $('.spinner').remove();
    addInfiniteScroll(getMoreComics);
  });
};

const drawThumbnails = (comics, mountPoint) => {
  const base = $('<div class="content-holder" />');
  for (let i = 0; i < comics.length; i++) {
    if (!(comics[i].thumbnail.path === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available')) {
      base.append(`<a href="./views/character.html?id=${comics[i].id  
                  }"><div class="card"><img src="${comics[i].thumbnail.path}.${ 
                  comics[i].thumbnail.extension}">${comics[i].name}</div></a>`);
    }
  }
  $(mountPoint).empty();
  $(mountPoint).append(base);
};