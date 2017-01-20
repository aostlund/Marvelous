const stateHandler = {
  set: (target, property, value) => {
    switch (property) {
      case 'expanded':
        expandCollapse(value, target[property] || 'null');
        target[property] = value;
        return true;
      default:
        const offset = target[property] ? target[property].length : 1;
        target[property] = value;
        if (target[property].length > 0) {
          updateHolder(property, offset);
          $('.spinner').remove();
        }
        return true;
    }
  }
};

const getInitialData = obj => {  
  $.when(
    $.get(`${obj.comics.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.events.collectionURI}?apikey=${apiKey}`),
    $.get(`${obj.series.collectionURI}?apikey=${apiKey}`)
  )
    .done((comics, events, series) => {
      state.comics = comics[0].data.results;
      state.events = events[0].data.results;
      state.series = series[0].data.results;
      state.expanded = 'comics';
    });
};

const characterId = location.search.split('id=')[1];
const state = new Proxy({}, stateHandler);
state.comics = state.events = state.series = [];
$.get(`https://gateway.marvel.com:443/v1/public/characters/${characterId}?apikey=${apiKey}`, result => {
  data = result.data.results[0];
  $('.main-linkback').attr('href', data.urls[0].url);
  $('h1').text(data.name);
  getInitialData(data);
  $('body').click(event => {
    state.expanded = event.target.id.split('-')[0];
  });
  addInfiniteScroll(getMoreData);
});