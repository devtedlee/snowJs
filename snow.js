let snowRootElement = document.getElementById('snow-root');
const settings = {
  totalCount: 200,
  paintDelay: 500,
};

function init() {
  if (snowRootElement) {
    snowRootElement = document.getElementById('snow-root');
  } else {
    snowRootElement = document.createElement('div');
    snowRootElement.id = 'snow-root';
    document.body.appendChild(snowRootElement);
  }

  let initHtml = '';
  let initCss = '';

  for (let i = 1; i < settings.totalCount; ++i) {
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
        transform:translate(${(randomX + randomO).toFixed(2)}vw, ${randomT}vh) scale(${randomS});
        opacity: 0.${randomT};
      }
      to {
        transform:translate(${(randomX + randomO / 2).toFixed(2)}vw, 105vh) scale(${randomS});
        opacity: ${randomOpacity};
      }
    }`;
  }

  snowRootElement.innerHTML = `
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

const paintSnow = debounce(() => {
  const snowCount = Math.round(settings.totalCount * (document.documentElement.clientWidth / 2560));
  const showSnows = snowRootElement.querySelectorAll('.snow-item.show');
  const hideSnows = snowRootElement.querySelectorAll('.snow-item.hide');
  const updateCount = showSnows.length - snowCount;

  const count = Math.abs(updateCount);
  for (let i = 0; i < count; ++i) {
    if (updateCount < 0) {
      hideSnows[i].classList.remove('hide');
      hideSnows[i].classList.add('show');
    } else {
      showSnows[i].classList.remove('show');
      showSnows[i].classList.add('hide');
    }
  }
}, settings.paintDelay);

function getRandom(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function debounce(cb, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

if (!snowRootElement) {
  init();

  addEventListener('resize', () => {
    paintSnow();
  });
}
