let comicsData;
let comicsArray = [];
$.get(`https://gateway.marvel.com:443/v1/public/characters?apikey=${apiKey}`, comics => {
  comicsData = comics.data;
  comicsArray = comicsArray.concat(comicsData.results);
  drawThumbnails(comicsArray, 'body');
  addInfiniteScroll(getMoreComics);
});

const getMoreComics = () => {
  $.get(`https://gateway.marvel.com:443/v1/public/characters?offset=${comicsArray.length}&apikey=${apiKey}`, comics => {
    comicsData = comics.data;
    comicsArray = comicsArray.concat(comicsData.results);
    drawThumbnails(comicsArray, 'body');
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