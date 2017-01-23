const getInitialData = obj => {  
  $.when(
    $.get(`${obj.comics.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.series.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.characters.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.creators.collectionURI}?apikey=${apiKey}`)
  )
    .done((comics, series, characters, creators) => {
      state.comics = comics[0].data.results;
      state.series = series[0].data.results;
      state.characters = characters[0].data.results;
      state.creators = creators[0].data.results;
      state.expanded = 'comics';
    });
};

const characterId = location.search.split('id=')[1];
const state = new Proxy({}, stateHandler);
state.comics = state.events = state.series = [];
$.get(`https://gateway.marvel.com:443/v1/public/events/${characterId}?apikey=${apiKey}`, result => {
  data = result.data.results[0];
  $('.main-linkback').attr('href', data.urls[0].url);
  $('h1').text(data.title);
  $('h3').html(data.description);
  $('.info-holder img').attr('src', `${data.thumbnail.path}.${data.thumbnail.extension}`);
  getInitialData(data);
  bindExpandCollapse();
  addInfiniteScroll(getMoreData);
});