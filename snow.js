// settings for snow
const _settings = {
  maxSnowCount: 200, // max snow count
  paintDelay: 500, // paint delay for resize event
  screenSize: 2560, // screen size denominator
};

/**
 * init snow elements
 */
function init() {
  if (_snowRootElement) {
    _snowRootElement = document.getElementById('snow-root');
  } else {
    _snowRootElement = document.createElement('div');
    _snowRootElement.id = 'snow-root';
    document.body.appendChild(_snowRootElement);
  }

  let initHtml = '';
  let initCss = '';

  for (let i = 1; i < _settings.maxSnowCount; ++i) {
    initHtml += '<i class="snow-item show"></i>';
    const randomX = getRandom(0, 1000000) * 0.0001,
      randomO = getRandom(-100000, 100000) * 0.0001,
      randomT = (getRandom(3, 8) * 10).toFixed(2),
      randomS = (getRandom(0, 10000) * 0.0001).toFixed(2),
      randomOpacity = (getRandom(1, 10000) * 0.0001).toFixed(2);
    initCss += `.snow-item:nth-child(${i}) {
      opacity: ${randomOpacity};
      transform: translate(${randomX.toFixed(2)}vw,-10px) scale(${randomS});
      animation: fall-${i} ${getRandom(10, 30)}s -${getRandom(0, 30)}s linear infinite;
    }
    @keyframes fall-${i} {
      0% {
        opacity: 0;
      }
      ${randomT}% {
        transform: translate(${(randomX + randomO).toFixed(2)}vw, ${randomT}vh) scale(${randomS});
        opacity: 0.${randomT};
      }
      to {
        transform: translate(${(randomX + randomO / 2).toFixed(2)}vw, 105vh) scale(${randomS});
        opacity: ${randomOpacity};
      }
    }`;
  }

  _snowRootElement.innerHTML = `
    <style>
      #snow-root {
        position:fixed;
        left:0;
        top:0;
        bottom:0;
        width:100vw;
        height:100vh;
        overflow:hidden;
        z-index:9999999;
        pointer-events:none
      }
      .snow-item {
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        margin-top:-10px;
      }
      .snow-item.hide {
        visibility: hidden;
      }
      .snow-item.show {
        visibility: visible;
      }
      ${initCss}
    </style>
    ${initHtml}`;

  paintSnow();
}

/**
 * paintSnow
 * painting snows not layout
 * debounce applied
 */
const paintSnow = debounce(() => {
  const snowCount = Math.round(_settings.maxSnowCount * (document.documentElement.clientWidth / _settings.screenSize));
  const showSnows = _snowRootElement.querySelectorAll('.snow-item.show');
  const hideSnows = _snowRootElement.querySelectorAll('.snow-item.hide');

  const count = Math.abs(showSnows.length - snowCount);
  for (let i = 0; i < count; ++i) {
    if (updateCount < 0) {
      hideSnows[i].classList.remove('hide');
      hideSnows[i].classList.add('show');
    } else {
      showSnows[i].classList.remove('show');
      showSnows[i].classList.add('hide');
    }
  }
}, _settings.paintDelay);

/**
 * getRandom
 * get random number
 * @param {*} min min
 * @param {*} max max
 * @returns number
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * debounce
 * @param {*} cb debounced callback
 * @param {*} delay delay milliseconds
 * @returns callback result
 */
function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

let _snowRootElement = document.getElementById('snow-root');

// init snow and event
if (!_snowRootElement) {
  init();

  addEventListener('resize', () => {
    paintSnow();
  });
}
