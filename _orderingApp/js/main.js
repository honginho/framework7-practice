'use strict';

window.onload = menuPrepared;

let menuTemplate = `
    <p>Left Panel content here</p>
    <p><a class="panel-close" href="/accordion-layout/">Accordion Layout</a></p>
    <p><a class="panel-close" href="/action-sheet/">Action Sheet</a></p>
`;

function menuPrepared() {
    menu = document.getElementById('menu');
    menu.innerHTML = menuTemplate;
    console.log('Menu prepared .');
}

let orderLists = [];
const app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    lazy: {
        threshold: 50
    },
    // Add default routes
    routes: [{
        path: '/accordion-layout/',
        url: 'accordionLayout.html'
    }, {
        path: '/action-sheet/',
        url: 'actionSheet.html'
    }, {
        path: '/menu/',
        url: 'menu.html'
    }, {
        path: '/checkout/',
        on: {
            pageInit: function () {
                console.log('Checkout page init .');
                setOrderList(orderLists);
            }
        },
        // 記錄點餐細項
        async (routeTo, routeFrom, resolve, reject) {
            if ($$('.total-price').text() !== '0') {
                prepareCheckout(orderLists);
                resolve({
                    url: 'checkout.html'
                })
            } else {
                toastCheckout.open();
                reject();
            }
        }
    }]
    // ... other parameters
});

const $$ = Dom7;

const mainView = app.views.create('.view-main');

$$(document).on('click', '.checkout', function () {
    let itemList = $$('.list ul li.swipeout');
    let itemCount = itemList.length
    let order = [];

    for (let i = 0; i < itemCount; i++) {
        order[i] = {
            name: itemList.eq(i).find('.item-content .item-inner > .item-title').text(),
            amount: itemList.eq(i).find('.item-content .item-media > .badge').text()
        }
    }

    alert(JSON.stringify(order));
});

let toastCheckout = app.toast.create({
    text: '您尚未點餐喔。',
    position: 'top',
    closeTimeout: 2000
});

function prepareCheckout(order) {
    let items = $$('.list li.item-choose');
    let countOrder = items.length;
    for (let i = 0; i < countOrder; i++) {
        order[i] = {};
        order[i].name = items.eq(i).find('.item-title').text();
        order[i].price = parseInt(items.eq(i).find('.item-price').text());
        order[i].amount = parseInt(items.eq(i).find('.item-amount').text());
    }
}

// $$(document).on('page:afterin', '.page[data-name="menu"]', function (e) {
//     console.log('Checkout page init .');
//     setOrderList(orderLists);
// })