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
  $('h1').text(data.title);
  $('h3').html(data.description);
  $('.info-holder>img').attr('src', `${data.thumbnail.path}.${data.thumbnail.extension}`);
  getInitialData(data);
  $('body').click(event => {
    state.expanded = event.target.id.split('-')[0];
  });
  addInfiniteScroll(getMoreData);
});