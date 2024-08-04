(function () {

    let hotelItemContainer;
    let rightHotelContainer;
    let usd;
    let eur;
    let hotelItems;
    let hotelStates;

    function init() {
        hotelItemContainer = document.querySelector("#hotel-container-items");
        rightHotelContainer = document.querySelector("#right-hotel-container");
        usd = document.getElementById('do');
        eur = document.getElementById('eu');

        getData();

    } // end of init

    function getData() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/Assets/data.json");

        xhr.onload = function () {
            if (this.status !== 200) {
                return;
            }

            const data = JSON.parse(this.responseText);
            hotelItems = data;
            showData(data);
            setListeners(data);
            hotelStates = [];
            for (let i = 0; i < 10; i++) {
                hotelStates.push(true);
            }//end of for
        };

        xhr.send();
    }

    // remove
    // add

    function setListeners(data) {

        usd.onclick = function () {
            hotelItemContainer.innerHTML = '';
            currency = "USD";
            showData(data);

            let detailPrice = document.getElementsByClassName('detail-price')[0];
            for (const hotel of data) {
                if (hotel.id.toString() === detailPrice.id) {
                    let actuallPrice = currency === "USD" ? hotel.price : (hotel.price * 0.85);
                    detailPrice.innerHTML = `<strong> ${getCurrencySymbol()}${disPrice(actuallPrice, hotel.discount).toFixed(2)} /night</strong>`
                }
            }
        }

        eur.onclick = function () {
            hotelItemContainer.innerHTML = '';
            currency = "EUR";
            showData(data);
            
            let detailPrice = document.getElementsByClassName('detail-price')[0];
            for (const hotel of data) {
                if (hotel.id.toString() === detailPrice.id) {
                    let actuallPrice = currency === "USD" ? hotel.price : (hotel.price * 0.85);
                    detailPrice.innerHTML = `<strong> ${getCurrencySymbol()}${disPrice(actuallPrice, hotel.discount).toFixed(2)} /night</strong>`
                }//end of if
            } //end of for
        } 
    }

    function showData(data) {
        for (const hotel of data) {

            const item = createItem(hotel);

            item.onclick = function () {
                const rightItem = createRightItem(hotel);
                rightHotelContainer.innerHTML = "";
                rightHotelContainer.appendChild(rightItem);

                let changeButton = document.getElementById('buttonChange');
              
                changeButton.onclick = function () {
                    hotelStates[hotel.id] = ! hotelStates[hotel.id];

                    if (hotelStates[hotel.id]) {
                        changeButton.classList.remove('btn-danger');
                        changeButton.classList.add('btn-primary');
                        changeButton.innerText = "Book now";
                    } else {
                        changeButton.classList.remove('btn-primary');
                        changeButton.classList.add('btn-danger');
                        changeButton.innerText = "Remove from booking";

                    }
                }
            };
            console.log("aaa");
            hotelItemContainer.appendChild(item);

        } //end of for
    }//end of function

    function createItem(hotel) {
        let actuallPrice = currency === "USD" ? hotel.price : hotel.price * 0.85; //
        const htmlString = `
    <div class="card touch mb-4">

    <div class="row">
      <div class="col-sm-5 pb-5 pt-2"> 
        <button type="button" class="btn discount mt-3 ml-4 ${
            removeDiscount(hotel.discount)}"> ${calculateDiscount(hotel.discount)}% OFF</button>
        <img id="${hotel.id}" class="img-fluid m-2 rounded" src="${hotel.imageUrl}" alt="${hotel.title}" >
      </div>
      
      <div class="col-sm-7 ">

        <div class="container">
          <div class="container mt-3">
          <div class="row">
            ${changeTags(hotel.tags)}
          </div>
        </div>

          <h6 class="mt-2 mb-4">${hotel.title}</h6>

          <div class="container mb-5 pb-5">
          <div class="row">
            <span class="col-1 badge bg-${changeName(hotel.rating).toLowerCase()} pt-1 mb-1">${hotel.rating}</span>
           <h6 class="col-3 ${changeName(hotel.rating).toLowerCase()}">${changeName(hotel.rating)}</h6>

           <tbody class="col-1 ">
            <tr class="mr-5 ">
              ${displayStars(hotel.rating)}
            </tr>
           </tbody>
          </div>
        </div>

          <div class="row pt-4 mt-5">
            <div class="col-8"></div>
            <div class="col-4">
              <p class="ml-5 pl-2"><del>${checkDiscount(actuallPrice, hotel.discount)} </del></p>
            <p><strong>${getCurrencySymbol()}${disPrice(actuallPrice, hotel.discount).toFixed(2)} /night</strong></p>
            </div>
          </div>
        </div>

        

      </div>
    </div>
  </div>
    `;

        const domParser = new DOMParser();
        const doc = domParser.parseFromString(htmlString, "text/html");
        const element = doc.body.childNodes[0];
        return element;
    }


    function calculateDiscount(discount) {
        
        let newDiscount = discount * 100;
        return newDiscount;
    }

    function removeDiscount(discount) {
        if (discount == null) {
            return "remove";
        } else {
            return "";
        }
    }

    function displayStars(rating) {
        let stars = "";
        for (let i = 0; i < Math.floor(rating); i++) {
            stars += '<td><i class="fas fa-star"></i></td>';
        }
        return stars;
    }

    function changeName(rating) {
        if (rating == 5) {
            return 'Perfect';
        } else if (rating >= 3.5) {
            return 'Good';
        } else {
            return 'Ok';
        }
    }

    function changeTags(tags) {

        if (tags == null) {
            return "";
        }
        let tag = "";
        for (let i = 0; i < tags.length; i++) { 
            // console.log(tags[i]);
            tag += `<button  class="mt-2 btn ${tags[i].type}Card mr-2">${tags[i].value} </button>`;
            // console.log("work...");
        }
        return tag;
    }


    function disPrice(price, discount) {

        price -= price * discount;
        return price;
    }

    function checkDiscount(price, discount) {
        if (discount != null) {
            return getCurrencySymbol() + price;
        } else {
            return "";
        }
    }

    function getCurrencySymbol() {
        return currency === "EUR" ? "€" : "$";
    }


    // right side of page

    function createRightItem(hotel) {
        let actuallPrice = currency === "USD" ? hotel.price : (hotel.price * 0.85); //
        const htmlString = `
    <div class="card cardRight">
            <button type="button" class="btn discount mt-3 ml-2 ${removeDiscount(hotel.discount)}">${calculateDiscount(hotel.discount)}% OFF</button>
            <img class="img-fluid" src="${hotel.imageUrl}" >
            
            <div class="container">
              
              <div class="container mt-3">
              <div class="row">
                ${changeTags(hotel.tags)}
              </div>
            </div>

              <h6 class="mt-2 mb-4"> ${hotel.title}</h6>

              <div class="container mb-5 pb-5">
              <div class="row">
                 <span class="col-1 badge bg-${changeName(hotel.rating).toLowerCase()} pt-1 mb-1">${hotel.rating}</span>
               <h6 class="col-3 ${changeName(hotel.rating).toLowerCase()}">${changeName(hotel.rating)}</h6>

               <tbody class="col-1 ">
                <tr class="mr-5 ">
                    ${displayStars(hotel.rating)}
                </tr>
               </tbody>
              </div>
            </div>

              <div class="row pt-4 mt-5">
                <div class="col-8"></div>
                <div class="col-4">
                  <p class="ml-5 pl-2"><del>${checkDiscount(actuallPrice, hotel.discount)}</del></p>
                <p class="detail-price" id="${hotel.id}"><strong>${getCurrencySymbol()}${disPrice(actuallPrice, hotel.discount).toFixed(2)} /night</strong></p>
                </div>
              </div>
            </div>

            <button type="button" id="buttonChange"  class="mr-3 ml-3 mb-3 btn ${hotelStates[hotel.id] ? 'btn-primary' : 'btn-danger'}">${hotelStates[hotel.id] ? 'Book now' : 'Remove from booking'}</button>
          </div>
        </div>


      </div>
  `;

        const domParser = new DOMParser();
        const doc = domParser.parseFromString(htmlString, "text/html");
        const element = doc.body.childNodes[0];
        return element;
    } //

    
    let currency = "USD";


    window.onload = function () {
        init();
    };


})();
