/* Common functions and variables */

/*-----------------------------------------
 Initialize and load search and about HTML
-----------------------------------------*/
const apiKey = '7ac875b0eeff11a2e08ae33e7f4e4003';
let data = {};
let searchBox;
let aboutBox;
$(() => {
  $.get('../views/search.html', search => {
    searchBox = search;
    $('#search').click(() => showSearch());  
  });
  $.get('../views/about.html', about => {
    aboutBox = about;
    $('#about').click(() => showAbout());
  });
});

/*-------------------------------------------------------------
 Proxy that handles updates to state.
 Expands collapse when state.expanded is updated.
 Update content holder when state is updated with new content.
 ------------------------------------------------------------*/
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
        } else {
          removeEmpty(property);
          $('.spinner').remove();
        }
        return true;
    }
  }
};

/*---------------
 shows About box
---------------*/
const showAbout = () => {
  $('#navbar').collapse('hide');
  if ($('.about').length === 0) {
    if ($('.search').first()) $('.search').first().remove();
    $('body').append(aboutBox);
    $('body').append($('<div class="darken"></div>'));
    $('.darken').on('click', showAbout);
    $('#close').on('click', showAbout);
  } else {
    $('.darken').removeh();
    $('.about').remove();
  }
}

/*----------------
 shows Search box
----------------*/
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

/*--------------------------------
 send search params to index page
--------------------------------*/
const marvelSearch = event => {
  event.preventDefault();
  location.href = `/index.html?${$('form').serialize()}`;
}

/*---------------------------------------------
 gets more data in the category thats expanded
---------------------------------------------*/
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

/*--------------------------
 builds cards to hold items
--------------------------*/
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

/*-------------------------------------------------------
 adds infinite scroll and runs given function on trigger
-------------------------------------------------------*/
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

/*---------------------------------------------------
 expands e and collapses old unless they're the same
---------------------------------------------------*/
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

/*-----------------------------------------
 updates content holder with the new data.
-----------------------------------------*/
const updateHolder = (name, offset) => {
  $(`#${name}`).append(state[name].slice(offset).map(item => {
    if (item.fullName) {
      return buildTextCard(item.fullName, item.id, `/views/${name.slice(0, -1)}.html`);
    } 
    return buildCard(item, `/views/${name.slice(0, -1)}.html`);
  }));
};

/*-----------------------
 get parameters from url
-----------------------*/
const getUrlProperties = url => {
  obj = {};
  if(url.split('?')[1]) {
    url.split('?')[1].split('&').forEach(prop => obj[prop.split('=')[0]] = prop.split('=')[1]);
  }
  return obj;
}

/*--------------------------------------
 binds listener for expand and collapse
--------------------------------------*/
const bindExpandCollapse = () => {
  $('body').click(event => {
    if (event.target.nodeName == 'H2') {
      state.expanded = event.target.innerText.split(' ')[0].toLowerCase();
    }
  });
}

/*--------------------------------------
 hides categories thad contains no data
--------------------------------------*/
const removeEmpty = (property) => {
  $('h2').each((_, header) => {
    if ($(header)[0].innerText.split(' ')[0].toLowerCase() == property) {
      $(header).hide();
    }
  });
}