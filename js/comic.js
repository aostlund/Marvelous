/* Js for comic page. Author: Andreas Östlund  */

const getInitialData = obj => {
  $.when(
    $.get(`${obj.characters.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.creators.collectionURI}?apikey=${apiKey}`)
  )
    .done((characters, creators) => {
      state.characters = characters[0].data.results;
      state.creators = creators[0].data.results;
      state.expanded = 'characters';
      if ((state.characters.length + state.creators.length) === 0) {
        $('<h3 class="info">No data available</h3>').insertBefore($('h2').first());
      }
    });
};

const characterId = location.search.split('id=')[1];
const state = new Proxy({}, stateHandler);
state.characters = state.creators = [];
$.get(`https://gateway.marvel.com:443/v1/public/comics/${characterId}?apikey=${apiKey}`, result => {
  data = result.data.results[0];
  $('.main-linkback').attr('href', data.urls[0].url);
  $('h1').text(data.title.toUpperCase());
  $('h3').html(data.description);
  $('.info-holder img').attr('src', `${data.thumbnail.path}.${data.thumbnail.extension}`);
  getInitialData(data);
  bindExpandCollapse();
  addInfiniteScroll(getMoreData);
});