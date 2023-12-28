'use strict'

var pages = [
  { name: 'splash', subpages: [] },
  { name: 'about', subpages: [] },
  { name: 'location', subpages: [] },
  { name: 'rush', subpages: ['schedule'] },
  { name: 'house',  subpages: ['summer'] },
  // { name: 'brothers',  subpages: ['the-brotherhood', 'seniors', 'juniors', 'sophomores', 'freshmen', 'graduates'] },
    { name: 'brothers',  subpages: ['seniors', 'juniors', 'sophomores', 'freshmen', 'graduates'] },
  { name: 'alumni',  subpages: [] },
  { name: 'contact', subpages: [] }
];

var allPages;
var parentMap;

function initializePages() {
  allPages = [];
  parentMap = [];
  for(var i = 0; i < pages.length; i++) {
    var parent = allPages.length;
    parentMap[allPages.length] = parent;
    allPages.push(pages[i].name);
    for(var j = 0; j < pages[i].subpages.length; j++) {
      parentMap[allPages.length] = parent;
      allPages.push(pages[i].name + "-" + pages[i].subpages[j]);
    }
  }
};

initializePages();

// prevent scrolling to different places concurrently
var scrollLock = null;
$(document).ready(function() {
  $('#fullpage').fullpage({
      afterLoad: afterLoad,
      onLeave: onLeave,
      anchors: allPages,
      slidesNavigation: true,
      slidesNavPosition: 'bottom',
      animateAnchor: false,
      responsiveWidth: 1080,
      responsiveHeight: 580
  });

  createHiddenNavbar();

  for(var i = 0; i < allPages.length; i++) {
    var page = allPages[i];
    $('.navbar-' + page).click((function(j) {
      if (scrollLock == null) {
        $.fn.fullpage.silentMoveTo(j+1);
        toggleHiddenNavbar(true);
      }
    }).bind(this, i));
  }

  $('.clickable-face img').on('mouseover', function() {
    $(this).css('filter', 'saturate(150%)');
  }).on('mouseout', function() {
    $(this).css('filter', '');
  });

  $('#page-splash').click(function() {
    window.location = '#about';
  });


    $(".ui.dropdown").dropdown({
    onChange: function (year) {
        setAlumni(year)
    }
    });
    initializeAlumni();

  $('#alumni-dropdown').on('mouseover', function() {
      if (scrollLock == null) {
          scrollLock = -1;
      }
  }).on('mouseout', function() {
      if (scrollLock == -1) {
          scrollLock = null;
      }
  });
});

function afterLoad(anchorLink, index) {
  index--;

  navbarLoad(index);
  highlightLoad(index);
  scrollLock = null;
}

function onLeave(index, nextIndex, direction) {
  index--;
  nextIndex--;

  if (scrollLock != null) {
    return false;
  }
  scrollLock = nextIndex;

  navbarTransition(index, nextIndex);
  highlightLoad(nextIndex);
}

var hiddenNavbarShowing = false;
function createHiddenNavbar() {
  var bar = $('#navbar').clone();
  bar.attr('id', 'hidden-navbar');
  bar.css('display', 'none');
  bar.appendTo('body');

  $('#navbar-toggle').click(function() {
    toggleHiddenNavbar();
  });
  $('#navbar-dimmer').click(function() {
    toggleHiddenNavbar(true);
  });
}

function toggleHiddenNavbar(hideOnly) {
  if (hiddenNavbarShowing) {
    $('#hidden-navbar').css('display', 'none');
    $('#navbar-dimmer').css('display', 'none');
    $('#navbar-toggle-button-closed').css('display', 'inline');
    $('#navbar-toggle-button-open').css('display', 'none');
  } else {
    $('#hidden-navbar').css('display', 'block');
    $('#navbar-dimmer').css('display', 'block');
    $('#navbar-toggle-button-open').css('display', 'inline');
    $('#navbar-toggle-button-closed').css('display', 'none');
  }
  hiddenNavbarShowing = !hiddenNavbarShowing;
}


function navbarLoad(index) {
  if(index == 0) {
   // $('#navbar').css('display', 'none');
  } else {
    $('body').append($('#navbar'));
    $('#navbar').css('height', '100%');
    $('#navbar').css('display', 'initial');
  }
}

function navbarTransition(index, nextIndex) {
  // 0 -> + : fixed to next section
  // + -> + : fixed to window
  // + -> 0 : fixed to current section
  // height is tricky since Firefox
  /*if(index == 0) {
    $('#page-' + allPages[nextIndex]).parent().append($('#navbar'));
    $('#navbar').css('height', $('#page-' + allPages[nextIndex]).height());
  } else if(nextIndex == 0) {
    $('#page-' + allPages[index]).parent().append($('#navbar'));
    $('#navbar').css('height', $('#page-' + allPages[index]).height());
  } else {
  */
    $('body').append($('#navbar'));
    $('#navbar').css('height', '100%');
  //}

  if(nextIndex != 0) {
    $('#navbar').css({display: 'initial'});
  }
}

function highlightLoad(index) {
  $(".navbar-entries li").removeClass("highlighted").removeClass("selected");
  $(".navbar-submenu li").removeClass("highlighted").removeClass("selected");
  if(index == 0) {
    return;
  }

  var parent = parentMap[index];
  var parentSelector = $(".navbar-" + allPages[parent]).parent().addClass("highlighted");
  if(index == parent) {
    parentSelector.addClass("selected");
  } else {
    $(".navbar-" + allPages[index]).addClass("selected");
  }
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var response = "a"
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                response = rawFile.responseText
            }
        }
    }
    rawFile.send(null);

    return response
}

function setDecade(year, lengthOfADecade) {
    $(".jimothy").html("<div class=\"alumni-year-bar content dark\"><h1>&nbsp;</h1><h2>Select a year</h2><div class=\"joel\"></div></div>")

    var innerHTML = ""
    for (var i = year; i < year+lengthOfADecade; i++) {
        innerHTML += "<a onclick=\"setAlumni(" + i + ")\" href=\"#alumni\"><h2><div>" + i + "</div></h2></a><br>"
    }
    $(".joel").html(innerHTML)
}


function getAlumniNames(year) {
    var alumni_str = readTextFile("txt/alumni.txt")

    alumni_str = alumni_str.slice(alumni_str.indexOf("Class of " + year) + 14)
    alumni_str = alumni_str.slice(0, alumni_str.indexOf("Class of")-2)

    return alumni_str.split("\n")
}

function setAlumni(year) {
    var alumniNames = getAlumniNames(year)
    var innerHTML = ""
    for (var i = 0; i < alumniNames.length; i++) {
        innerHTML += "<li>" + alumniNames[i] + "</li>"
    }
    $(".alumni-list").html(innerHTML)
}

function initializeAlumni() {
    var innerHTML = ""
    for (var year = 2020; year >= 1950; year--) {
        innerHTML += "<div class=\"item\" data-value=\"" + year + "\">Class of " + year + "</div>"
    }
    $("#alumni-dropdown").html(innerHTML)
}

initializeAlumni();