const getInitialData = obj => {  
  $.when(
    $.get(`${obj.comics.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.events.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.characters.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.creators.collectionURI}?apikey=${apiKey}`)
  )
    .done((comics, events, characters, creators) => {
      state.comics = comics[0].data.results;
      state.events = events[0].data.results;
      state.characters = characters[0].data.results;
      state.creators = creators[0].data.results;
      state.expanded = 'comics';
      if ((state.comics.length + state.events.length + state.characters.length + state.creators.length) === 0) {
        $('<h3 class="info">No data available</h3>').insertBefore($('h2').first());
      }
    });
};

const characterId = location.search.split('id=')[1];
const state = new Proxy({}, stateHandler);
state.comics = state.events = state.series = [];
$.get(`https://gateway.marvel.com:443/v1/public/series/${characterId}?apikey=${apiKey}`, result => {
  data = result.data.results[0];
  $('.main-linkback').attr('href', data.urls[0].url);
  $('h1').text(data.title);
  getInitialData(data);
  bindExpandCollapse();
  addInfiniteScroll(getMoreData);
});