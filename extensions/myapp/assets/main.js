document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup block loaded 123...');
  init();
});

const init = () => {
  dialogUI();
  addEventListeners();
}

const addEventListeners = () => {
  delegateEventListener(document, 'click', '.js-dialog-close', () => {
    const dialog = document.querySelector('.js-popup-modal');
    if(!dialog) return;
    dialog.close();
    document.body.style.overflow = 'auto';
  });

  delegateEventListener(document, 'click', '.js-dialog-cart-close', () => {
      const dialog = document.querySelector('.js-cart-dialog');
      console.log(dialog, 'found...')
    dialog?.close();
  });

  delegateEventListener(document, 'click', '.js-checkout-button', async ({event}) => {
    event.preventDefault();
    const response = await fetch('/cart.js');
    const data = await response.json();
    console.log('data', response)
    if(!data || !data.item_count) {
      return;
    }
    window.location = `/checkouts/cn/${data.token}`
  });

  delegateEventListener(document, 'click', '.js-add-to-cart', handleAddToCart);
}

const delegateEventListener = (context, event, match, cb) => {
  context.addEventListener(event, (e) => {
    if (e.target.classList.contains(match)) {
      cb({ event: e, element: e.target });
      return;
    }

    if (e.target.closest(match)) {
      cb({ event: e, element: e.target.closest(match) });
      return;
    }
  });
};

const getDialogfromDb = async () => {
  const shop = window.Shopify.shop;
  const url = '/apps/popup';
  try {
    const response = await fetch(`${url}/${shop}`);
    return await response.json();
  } catch(e) {
    console.log(`An error occurred: ${e}`)
  }
}

const dialogUI = async () => {
  const data = await getDialogfromDb();
  if (!data.success) return;

  const dialog = document.querySelector('.js-popup-modal');
  if(!dialog) return;

  await appendHtml(data.data, dialog, '.dialog__products');

  const products = dialog.querySelectorAll('.dialog__product');

  const dialogSetTimeout = setTimeout(() => {
    dialog.show();
    document.body.style.overflow = 'hidden';
    products.forEach((product, index) => {
      const id = setTimeout(() => {
        product.classList.add('slide-in');
        clearTimeout(id);
      }, 250 * index + 0.5);
    });
    clearTimeout(dialogSetTimeout);
  }, 500);
}

const handleAddToCart = async ({ element }) => {
  const id = element.closest('.dialog__product')?.dataset.id;
  if (!id) return;

  const response = await addToCart(id);
  if(response && response.data == "200") {
    const cartDialog = document.querySelector('.js-cart-dialog');
    cartDialog?.show();
  }
};

const addToCart = async (id) => {
  try {
      const res = await fetch(window.Shopify.routes.root + 'cart/add', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          id,
          quantity: 1,
        }),
      });
      
      return {
        data: res.status
      }

    } catch (e) {
      console.log('Error.....', e);
    }
}

const appendHtml = (html, element, test) => {
  return new Promise((resolve) => {
    element.innerHTML += html;
    const id = setInterval(() => {
      if (element.querySelector(test)) {
        resolve(element);
        clearInterval(id);
      }
    }, 100);
  });
};

const getCookie = (name) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";

}

const setCookie = (name, value, duration) => {
  const date = new Date();
  date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000)); // 30 days
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}