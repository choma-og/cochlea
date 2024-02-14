import Swiper, { Navigation, Pagination, EffectFade, Autoplay, FreeMode } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '@/styles/style.scss';
import axios from 'axios';
import IMask from 'imask';
import gsap from 'gsap';

// ===== BURGER =====
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

let overlay = document.createElement('div');
overlay.className = 'overlay';
if(iconMenu) {
	iconMenu.addEventListener("click", e => {
		e.preventDefault();
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('active');
		menuBody.classList.toggle('active');

    document.body.appendChild(overlay);
    overlay.classList.toggle('active')
	})
}
overlay.addEventListener('click', function () {
  document.body.classList.toggle('_lock');
  iconMenu.classList.toggle('active');
  menuBody.classList.toggle('active');
  overlay.classList.toggle('active')
});

const navLink = document.querySelectorAll('.menu__link')

const linkAction = () =>{
  document.body.classList.remove('_lock');
  iconMenu.classList.remove('active');
  menuBody.classList.remove('active');
  overlay.classList.remove('active')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// reviewsSwiper
var reviewsSwiper = new Swiper(".reviews__swiper", {
	// spaceBetween: 10,
	// slidesPerView: 2,
	loop: false,
	centeredSlides: false,
	modules: [Navigation, Pagination],
	navigation: {
		nextEl: ".reviews-next",
		prevEl: ".reviews-prev",
	},
  breakpoints: {
      1: {
        slidesPerView: 'auto',
        centeredSlides: false,
        spaceBetween: 10,
      },
      850: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      968: {
        slidesPerView: 2,
        centeredSlides: false,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },
});

// aboutSwiper
var aboutSwiper = new Swiper(".about__swiper", {
	// spaceBetween: 40,
	// slidesPerView: 2,
	loop: false,
	centeredSlides: false,
	modules: [Navigation, Pagination],
	navigation: {
		nextEl: ".about-next",
		prevEl: ".about-prev",
	},
  breakpoints: {
      1: {
        slidesPerView: 'auto',
        centeredSlides: false,
        spaceBetween: 10,
      },
      850: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      968: {
        slidesPerView: 2,
        centeredSlides: false,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },

  
});

/*=============== INPUT MASK ===============*/
// Найти все элементы с атрибутом data-mask="phone"
let phones = document.querySelectorAll('[data-mask="phone"]');

// Применить маску к каждому найденному элементу
phones.forEach(function(element) {
  new IMask(element, {
    mask: '+{7}(000)000-00-00'
  });
});

/*=============== AXIOS ===============*/
function validatePhone(phone)  {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length)
  console.log(cleanedPhone.length === 11, "partial")

  if(cleanedPhone.length === 11) {
    return true; 
  } else {
    return false;
  }
}

function validateText(text)  {
  const trimmedText = text.trim();

    if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}
const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;

  switch(dataType) {
      case "phone": 
      res = validatePhone(input.value)
      break;
      case "text": 
      res = validateText(input.value)
      break;
  }
  console.log(input, res, dataType)
  return res;
}

let forms = document.querySelectorAll('.js-form');
console.log(forms)
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
	console.log(formButton)
	if(formButton) {
		formButton.addEventListener("click", (e) => {
		e.preventDefault();
		formButton.disabled = true;
		const inputs = form.querySelectorAll("input");
		const method = form.method;
		const action = form.action;
		let isValidated = true;
		let formData = [];

		inputs.forEach(input => {
      formData.push({
        name: input.name,
        value: input.value,
        isValidate: validate(input),
      })  
  })

	formData.forEach(item => {
    const input = form.querySelector(`[name="${item.name}"]`);
    const wrapper = input.parentNode;
    const errorBlock = wrapper.querySelector('.js-error');

    if(!item.isValidate) {
        isValidated = false;
        errorBlock.classList.add("_active")
        wrapper.classList.add("_active")
    } else {
        errorBlock.classList.remove("_active");
        wrapper.classList.remove("_active")
    }
  })

	if(!isValidated) {
    formButton.disabled = false;
    return false;
  }

	axios({
		method,
		url: action,
		data: formData,
}).then((response) => {
  sucesOpen();
		console.log("success");
		formButton.disabled = false;
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
      // Очистка полей ввода
    inputs.forEach(input => {
      input.value = "";
    });
}).catch((error) => {
		console.error(error);
    document.body.classList.remove("_lock");
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
    sucesOpen();
		formButton.disabled = false;
    inputs.forEach(input => {
      input.value = "";
    });
	});
})
	}
})


/*=============== MODAL ===============*/
const modalBody = document.querySelector('.modal__body');
const modalButtons = document.querySelectorAll('.js-open-modal');
const modalContent = document.querySelector('.modal__content');
const modalClose = document.querySelector(".modal__close");
const errorBlock = document.querySelectorAll('.js-error');
const modalInputs = document.querySelectorAll("input")

if(modalButtons) {
modalButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    document.body.classList.add("_lock");
    modalBody.classList.add("_active");
    modalContent.classList.add("_active");
  });
});
}

if (modalClose) {
  modalClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalBody.classList.remove("_active");
    modalContent.classList.remove("_active");
    errorBlock.forEach((item) => {
      item.classList.remove("_active")
    }
    );
    modalInputs.forEach(input => {
      input.value = "";
    });
  });
}
/*=============== SUCES ===============*/
const sucesBody = document.querySelector('.suces__body');
const sucesContent = document.querySelector('.suces__content');
const sucesClose = document.querySelector('.js-close-modal');
  function sucesOpen() {
    sucesBody.classList.add('_active');
    sucesContent.classList.add('_active');
    document.body.classList.add('_lock');
}

  if(sucesClose) {
    sucesClose.addEventListener("click" , (e) => {
    sucesBody.classList.remove("_active");
    sucesContent.classList.remove('_active');
    document.body.classList.remove('_lock');
})
}



/*=============== MAP ===============*/
document.addEventListener('DOMContentLoaded', function () {
  if (ymaps) {
    ymaps.ready(initializeMaps);
  }
});

let centerCochlea = [53.339054992487846,83.6689115423278];

function initializeMaps() {
	let mapCochlea = new ymaps.Map('map-cochlea', {
		center: centerCochlea,
		zoom: 16,
	});
	let placemarkCochlea = new ymaps.Placemark([53.339054992487846,83.6689115423278], {}, {
		iconLayout: 'default#image',
		iconImageHref: '/public/map-point.jpeg',
		iconImageSize: [37, 37],
		iconImageOffset: [-20, -30]
	});
	mapCochlea.controls.remove('geolocationControl');
	mapCochlea.controls.remove('searchControl');
	mapCochlea.controls.remove('trafficControl');
	mapCochlea.controls.remove('typeSelector');
	mapCochlea.controls.remove('rulerControl', {
		scaleLine: false,
	});
	mapCochlea.geoObjects.add(placemarkCochlea);
}



