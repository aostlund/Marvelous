const apiKey = '7ac875b0eeff11a2e08ae33e7f4e4003';
let data = {};
let searchBox;
let aboutBox;
$.get('../views/search.html', search => {
  searchBox = search;
  $('#search').click(() => showSearch());  
});
$.get('../views/about.html', about => {
  aboutBox = about;
  $('#about').click(() => showAbout());
})

const showAbout = () => {
  $('#navbar').collapse('hide');
  if ($('.about').length === 0) {
    if ($('.search').first()) $('.search').first().remove();
    $('body').append(aboutBox);
    $('body').append($('<div class="darken"></div>'));
    $('.darken').on('click', showAbout);
    $('form').on('submit', marvelSearch);
    $('#close').on('click', showAbout);
  } else {
    $('.darken').remove();
    $('.about').remove();
  }
}

const showSearch = () => {
  $('#navbar').collapse('hide');
  if ($('.search').length === 0) {
    if ($('.about').first()) $('.about').first().remove();
    $('body').append(searchBox);
    $('body').append($('<div class="darken"></div>'));
    $('.darken').on('click', showSearch);
    $('form').on('submit', marvelSearch);
    $('#close').on('click', showSearch);
  } else {
    $('.darken').remove();
    $('.search').remove();
  }
}

const marvelSearch = event => {
  event.preventDefault();
  location.href = `/index.html?${$('form').serialize()}`;
}

const getMoreData = () => {
  const offset = state[state.expanded].length;
  if (offset < data[state.expanded].available) {
    $('body').prepend('<div class="spinner" />');
    $.get(`https://gateway.marvel.com/v1/public/events/${characterId}/${state.expanded}?offset=${offset}&apikey=${apiKey}`, comics => {
      state[state.expanded] = state[state.expanded].concat(comics.data.results);
    });
  }
  addInfiniteScroll(getMoreData);
};

const buildCard = (obj, linkPage) => {
  const output = $(`<a href="${linkPage}?id=${obj.id}"><div class="card" /></a>`);
  $('.card', output)
    .append(`<img src="${obj.thumbnail.path}/portrait_uncanny.${obj.thumbnail.extension}">`)
    .append(`<a href="${obj.urls[0].url}"><img class="linkback" src="../img/marvel-logo.svg"></a>`)
    .append(`<p>${obj.title || obj.name}</p>`);
  return output;
};

const buildTextCard = (string, id, linkPage) => {
  const output = $(`<a href="${linkPage}?id=${id}"><div class="text-card" /></a>`);
  $('.text-card', output)
    .append(`<p>${string}</p>`);
  return output;
};

const addInfiniteScroll = (fn) => {
  $(window).scroll(() => {
    const above = $(window).scrollTop();
    const docH = $(document).height();
    const winH = $(window).height();
    if (above >= (docH - (2 * winH))) {
      $(window).unbind('scroll');
      fn();
    }
  });
};

const expandCollapse = (e, old) => {
  console.log(e, old)
  if ($(`#${e}`).css('height') === '0px') {
    $(`#${e}`).css('height', 'auto');
    $(`#${e}-btn`)[0].innerText = 'remove_circle';
    if (e !== old) {
      $(`#${old}`).css('height', '0px');
      $(`#${old}-btn`)[0] ? $(`#${old}-btn`)[0].innerText = 'add_circle' : null;
    }
  } else {
    $(`#${e}`).css('height', '0px');
    $(`#${e}-btn`)[0].innerText = 'add_circle';
  }
};

const updateHolder = (name, offset) => {
  $(`#${name}`).append(state[name].slice(offset).map(item => {
    if (item.fullName) {
      return buildTextCard(item.fullName, item.id, `/views/${name.slice(0, -1)}.html`);
    } 
    return buildCard(item, `/views/${name.slice(0, -1)}.html`);
  }));
};

const getUrlProperties = url => {
  obj = {};
  if(url.split('?')[1]) {
    url.split('?')[1].split('&').forEach(prop => obj[prop.split('=')[0]] = prop.split('=')[1]);
  }
  return obj;
}
