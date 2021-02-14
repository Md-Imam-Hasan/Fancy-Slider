const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
const inputDuration = document.getElementById('duration');
const countSelectedItem = document.getElementById("count-selected-item");

// selected image 
let sliders = [];

//  api key
const KEY = '20267922-50c82c3a9bc9cb1a2ca288c83';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  // show gallery title
  galleryHeader.style.display = 'flex';
  imageCount(images.length);
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toogleSpinner();
}

const getImages = (query) => {
  gallery.innerHTML = '';
  toogleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    selectedImageCount(1);
  } else if (item > -1) {
    sliders.splice(item, 1);
    selectedImageCount(0);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // check Slider change duration
  const duration = inputDuration.value || 1000;
  if (duration <= 0) {
    alert("Slider change duration can't be zero or negetive");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';

  // new initial constraints
  if (!spinner.classList.contains('d-none')) {
    spinner.classList.add('d-none')
  }
  inputDuration.value = '';
  countSelectedItem.classList.add("d-none");
  selectedImageNumber = 0;

  clearInterval(timer);
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// Search for enter button press
search.addEventListener("keypress", function (event) {
  if (event.key == 'Enter') {
    searchBtn.click();
  }
})

// Loading spinner 
const spinner = document.getElementById("spinner");
const toogleSpinner = () => {
  spinner.classList.toggle("d-none");
}

// Selected item number count
let selectedImageNumber = 0;
const selectedImage = document.getElementById("selected-image");
const imageCount = (totalImage) => {
  countSelectedItem.classList.remove("d-none");
  selectedImage.innerText = selectedImageNumber;
  document.getElementById("total-image").innerText = totalImage
}
const selectedImageCount = (addOrRemove) => {
  if (addOrRemove) {
    selectedImageNumber++;
  } else {
    selectedImageNumber--;
  }
  selectedImage.innerText = selectedImageNumber;
}