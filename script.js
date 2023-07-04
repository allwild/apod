const body = document.querySelector("body");
const API_KEY = "VxQ74EyGWfFeQPFrFPLyVKGH5OwRK523uUmpI5cY";
let link =
  `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;


/* Adds img or video to the APOD section based on the fetched data */
function addMedia(data) {
  let title = document.querySelector("#title");
  if (data.media_type === "video") {
    title.insertAdjacentHTML(
      "afterend",
      `
    </br><iframe id="pod" src="${data.url}"></iframe></br>
    `
    );
  } else {
    title.insertAdjacentHTML(
      "afterend",
      `
    </br><img id="pod" src=${data.url}></br>
    `
    );
  }
}
  

/* adds an event listener to the date selector  */
function addEventListener() {
  const dateSelector = document.querySelector("#myDateInput");
  const apod = document.querySelector("#apod");
  const image = document.querySelector("#pod");
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  
  dateSelector.addEventListener("input", function () {
    let newLink = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${this.value}`;
    
    fetch(newLink)
      .then((response) => response.json())
      .then((data) => {
        updateApod(data, image, title, description);        
      });
  });
}

/* Update the APOD section based on fetched data of the selected date */
function updateApod(data, image, title, description) {
  title.innerHTML = data.title;
  description.innerHTML = data.explanation;
  image.src = data.url;
} 


/* Creates a scaffold for the gallery  */
function addFrame() {
  body.insertAdjacentHTML(
    "beforeend",
    `
  <header>
    <nav>
      <ul>
        <li><img src="./img/NASA_logo.svg.png"></li>
        <li><a href="#gallery-wrapper">Gallery</a></li>
      <ul>
    </nav>
  </header>
  <main>
  </main>`
  );
}

/* Creates a scaffold for the APOD section   */
function handlePictureData (picData) {
  const main = document.querySelector('main')
  main.insertAdjacentHTML(
    "afterbegin",
    `
    <div id="apod">
        <h1 id="title">${picData.title}</h1>
        <p id="description">${picData.explanation}</p></br>
        <span><b>See earlier images: </b></span><form><input type="date" id="myDateInput"></form> 
    </div>  
  `
  )
}


function callFetch(link) {
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      handlePictureData(data);
      addMedia(data);
      addEventListener();
    });
}

function getTodayDate(i) {
  var d = new Date();
  d.setDate(d.getDate() - i);

  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}

/* Adds an additional section (#gallery-wrapper) for the images of the last 8 days */
function insertGallery () {
  const link = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=`
  const main = document.querySelector('main')
  main.insertAdjacentHTML('beforeend', `
  <div id="gallery-wrapper">
    <h1>Don't miss out on more pics from last days</h1>
    <div id="pic-wrapper"></div>
  </div>`)
  let picWrapper = document.querySelector('#pic-wrapper')
  for (let index = 0; index < 8; index++) {
    fetch(link + (getTodayDate(index)))
      .then((response) => response.json())
      .then((data) => {
        if (data.media_type === "video") {
          picWrapper.insertAdjacentHTML('beforeend', `
            <iframe alt="${data.explanation}" id="${getTodayDate(index)}" class="gallery-pic" src="${data.url}" title="${data.title}"></iframe>
          `)
        } else {
          picWrapper.insertAdjacentHTML('beforeend', `
            <img alt="${data.explanation}" id="${getTodayDate(index)}" class="gallery-pic" src="${data.url}" title="${data.title}">
          `)
        }
      })
  }
}

function createModal () {
  const galleryImages = document.querySelectorAll('.gallery-pic');
  galleryImages.forEach(image => {
    image.addEventListener('click', () => {
      const imageTitle = image.getAttribute('title');
      const imageDescription = image.getAttribute('alt')
      const imageUrl = image.getAttribute('src');
      const modalImage = new Image();
      modalImage.setAttribute('src', imageUrl);
      body.insertAdjacentHTML('beforeend', `
      <div id='modal-container'>
        <h1 id="modal-heading">${imageTitle}</h1>
        <i id="esc-X"class="fa-regular fa-circle-xmark fa-2xl"></i>
        
        <p id="modal-caption">${imageDescription}</p>
      </div>
      `)
      const modalContainer = document.querySelector('#modal-container');
      const modalCaption = document.querySelector('#modal-caption')
      const quitButton = document.querySelector('#esc-X');
      modalContainer.insertBefore(modalImage, modalCaption);
      quitButton.addEventListener('click', () => {
        modalContainer.remove()
      })
    });
  });
}



addFrame();
callFetch(link);
insertGallery();
setTimeout(createModal, 1000);

