const products = [
  {
    id: "mabel",
    name: "Mabel's Morning Matcha",
    flavor: "Classic",
    price: 28,
    character: "Mabel Furbert",
    mood: "clean, steady, built for the first quiet cup",
    tags: ["ceremonial", "smooth", "daily"],
    notes: "Soft creaminess, clean finish, and enough depth to make the morning ritual feel intentional.",
    reviews: [
      ["Nina R.", "Tastes serious without acting fancy. I use it every weekday."],
      ["Marco T.", "The placeholder is honest, and the brand still feels considered."],
    ],
  },
  {
    id: "bertie",
    name: "Bertie's Brown Sugar Matcha",
    flavor: "Brown Sugar",
    price: 30,
    character: "Bertie Furbert",
    mood: "brown sugar warmth without turning the cup into dessert",
    tags: ["sweet", "latte", "best seller"],
    notes: "Ceremonial base with a brown sugar lean. Built for iced lattes and second cups.",
    reviews: [
      ["Sam K.", "Dessert-ish, but still tastes like matcha. That balance is hard."],
      ["Gia P.", "This is my 3pm reset. Bertie gets me."],
    ],
  },
  {
    id: "tess",
    name: "Tessie's Toasted Vanilla",
    flavor: "Vanilla",
    price: 31,
    character: "Tessie Furbert",
    mood: "toasted vanilla, measured and grown-up",
    tags: ["vanilla", "cozy", "latte"],
    notes: "Toasty vanilla, mellow body, and a finish that does not taste like a candle.",
    reviews: [
      ["Ari L.", "Vanilla matcha usually scares me. This one is gentle and not fake."],
      ["Jules M.", "The copy sold me. The latte kept me."],
    ],
  },
  {
    id: "uncle-lou",
    name: "Uncle Lou's Plain Green",
    flavor: "Classic",
    price: 26,
    character: "Uncle Lou Furbert",
    mood: "plain green, no performance",
    tags: ["earthy", "starter", "clean"],
    notes: "A grounded ceremonial matcha for people who want the ritual without the museum price.",
    reviews: [
      ["Ren D.", "Simple, bright, and affordable enough to drink daily."],
      ["Mal B.", "No weird bitterness. Lou can stay."],
    ],
  },
  {
    id: "dot",
    name: "Dot's Butter Cream Matcha",
    flavor: "Butter Cream",
    price: 32,
    character: "Dot Furbert",
    mood: "rich, rounded, deliberately a little strange",
    tags: ["creamy", "limited", "bold"],
    notes: "A richer matcha profile with a buttery dessert note that still keeps its green backbone.",
    reviews: [
      ["Tara W.", "Weird in the exact right way."],
      ["Lee F.", "The flavor has personality, not perfume."],
    ],
  },
  {
    id: "frankie",
    name: "Frankie's Whisk Kit",
    flavor: "Accessories",
    price: 22,
    character: "Frankie Furbert",
    mood: "the ritual kit for people who like their tools in reach",
    tags: ["kit", "ritual", "starter"],
    notes: "A starter whisk, scoop, and counter card for turning five minutes into a proper little ritual.",
    reviews: [
      ["Bea S.", "Bought it with the classic tin. It made mornings feel less improvised."],
      ["Omari N.", "Useful, sturdy, and cute without being babyish."],
    ],
  },
];

const family = [
  ["Mabel", "Quality control in human form. Quiet, exacting, and impossible to rush."],
  ["Bertie", "The flavor archivist. Keeps the sweet notes grounded and the tins memorable."],
  ["Tessie", "Keeper of the ritual. She believes the cup should feel calm, not precious."],
  ["Uncle Lou", "The skeptic. If a blend passes Lou, it is ready for daily use."],
];

let cart = JSON.parse(localStorage.getItem("furbertsCart") || "[]");
let addedReviews = JSON.parse(localStorage.getItem("furbertsReviews") || "{}");

const app = document.querySelector("#app");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartSubtotal = document.querySelector("#cartSubtotal");
const nav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("furbertsCart", JSON.stringify(cart));
  renderCart();
}

function productImage(product, big = false) {
  return `
    <div class="product-placeholder illustrated-tin ${big ? "big-placeholder" : ""}" aria-label="Illustrated tin for ${product.name}">
      <div class="tin">
        <div class="tin-top"><span></span></div>
        <div class="tin-label">
          <span class="tin-monogram" aria-hidden="true">FM</span>
          <strong>${product.flavor}</strong>
          <span>${product.character}</span>
        </div>
        <div class="tin-bottom"><span>ceremonial / 40g</span></div>
        <i class="tin-shine" aria-hidden="true"></i>
      </div>
      <span class="tin-halftone-puff" aria-hidden="true"></span>
      <span class="tin-sketch-line" aria-hidden="true"></span>
    </div>
  `;
}

function mascot(name, className = "") {
  const initial = name.trim()[0] || "F";
  return `<span class="furbert ${className}" aria-hidden="true">${initial}</span>`;
}

const mascotAssets = {
  "Mabel Furbert": "Mom-v2.png",
  "Bertie Furbert": "Brother-v2.png",
  "Tessie Furbert": "Sister-v2.png",
  "Uncle Lou Furbert": "Dad-v2.png",
  "Dot Furbert": "Ly.png",
  "Frankie Furbert": "Brother-v2.png",
  Mabel: "Mom-v2.png",
  Bertie: "Brother-v2.png",
  Tessie: "Sister-v2.png",
  "Uncle Lou": "Dad-v2.png",
};

function mascotImage(character, className = "") {
  const asset = mascotAssets[character] || "Small_Cat.png";
  return `<img class="${className}" src="assets/${asset}" alt="" aria-hidden="true" />`;
}

function productCard(product) {
  const issue = String(products.findIndex((item) => item.id === product.id) + 1).padStart(2, "0");
  return `
    <article class="product-card">
      <span class="product-issue" aria-hidden="true">TIN_${issue}</span>
      <a href="#product/${product.id}">${productImage(product)}</a>
      <span class="sticker-frame product-sticker">${mascotImage(product.character, "card-mascot character-cutout")}</span>
      <h3><a href="#product/${product.id}">${product.name}</a></h3>
      <p class="product-mood">${product.mood}</p>
      <div class="product-meta">
        <span class="price-tag">${money(product.price)}</span>
        <span>${product.flavor}</span>
      </div>
      <button class="primary-action" type="button" data-add="${product.id}">Add to cart</button>
    </article>
  `;
}

function featuredReviews() {
  return products
    .slice(0, 3)
    .map((product) => {
      const [name, quote] = product.reviews[0];
      return `
        <article class="review speech-bubble">
          <strong><span class="review-avatar" aria-hidden="true">${name.trim()[0]}</span>${name}</strong>
          <p>"${quote}"</p>
          <span class="tag">${product.name}</span>
        </article>
      `;
    })
    .join("");
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="shape-cluster hero-shapes" aria-hidden="true">
        <span class="shape shape-sun"></span>
        <span class="shape shape-orbit"></span>
        <span class="shape shape-cross"></span>
        <span class="shape shape-capsule"></span>
      </div>
      <div class="hero-copy">
        <div class="retro-window-tabs" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="eyebrow">Ceremonial-grade matcha, domestic roots, fictional house lore</p>
        <h1>The Furberts moved into your morning.</h1>
        <p>
          Good matcha for every day.
        </p>
        <div class="hero-actions">
          <a class="primary-action" href="#shop">Shop the first drop</a>
          <a class="text-action" href="#about">Meet the household <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="product-stage">
        <span class="comic-thought-bubble" aria-hidden="true">whisk first, questions later</span>
        <span class="comic-sfx sfx-sip" aria-hidden="true">sip!</span>
        <span class="speed-lines" aria-hidden="true"></span>
        <img class="hero-mascot hero-mascot-brother" src="assets/Brother-v2.png" alt="Brother Furbert" />
        <img class="hero-mascot hero-mascot-cat" src="assets/Small_Cat.png" alt="Small cat mascot" />
        <div class="search-pill" aria-hidden="true">
          <span>Find your Furbert</span>
          <strong>+</strong>
        </div>
        <div class="hero-drink-card" aria-label="Matcha latte product image">
          <img src="assets/matcha-glass.png" alt="Iced matcha latte in a glass" />
        </div>
      </div>
    </section>

    <div class="panel-seam" aria-hidden="true"></div>

    <section class="section butter-band">
      <div class="shape-cluster product-shapes" aria-hidden="true">
        <span class="shape shape-checker"></span>
        <span class="shape shape-ring"></span>
        <span class="shape shape-diamond"></span>
      </div>
      <div class="section-head">
        <div>
          <p class="eyebrow">First episode lineup</p>
          <h2>Big tins, quiet credibility.</h2>
        </div>
        <a class="shelf-link" href="#shop">Shop all tins <span aria-hidden="true">→</span></a>
        <img class="section-peek section-peek-mom" src="assets/Mom-v2.png" alt="" aria-hidden="true" />
      </div>
      <div class="product-grid featured-shelf">${products.slice(0, 3).map(productCard).join("")}</div>
    </section>

    <div class="panel-seam" aria-hidden="true"></div>

    <section class="section brown-band">
      <div class="shape-cluster cast-shapes" aria-hidden="true">
        <span class="shape shape-orbit"></span>
        <span class="shape shape-flower"></span>
        <span class="shape shape-squiggle"></span>
      </div>
      <div class="section-head">
        <div>
          <p class="eyebrow">The house cast</p>
          <h2>Dispersed, opinionated, useful.</h2>
        </div>
      </div>
      <div class="home-family-shelf" aria-hidden="true">
        <img class="family-shelf-mascot" src="assets/Brother-v2.png" alt="" />
        <img class="family-shelf-mascot" src="assets/Sister-v2.png" alt="" />
        <img class="family-shelf-mascot family-shelf-cat" src="assets/Big_Cat.png" alt="" />
      </div>
      <div class="character-strip">
        ${family
          .map(
            ([name, copy]) => `
          <article class="character-card">
            <img class="character-face character-cutout" src="assets/${mascotAssets[name] || "Ly.png"}" alt="${name} Furbert" />
            <h3>${name} Furbert</h3>
            <p>${copy}</p>
          </article>
        `
          )
          .join("")}
      </div>
    </section>

    <div class="panel-seam" aria-hidden="true"></div>

    <section class="section">
      <div class="shape-cluster trust-shapes" aria-hidden="true">
        <span class="shape shape-sun"></span>
        <span class="shape shape-capsule"></span>
        <span class="shape shape-cross"></span>
      </div>
      <div class="trust-grid">
        <article class="trust-card">
          <img class="trust-mascot trust-mascot-dad" src="assets/Dad-v2.png" alt="Dad Furbert" />
          <div class="component-badge stamp-badge" aria-hidden="true">Daily<br />grade</div>
          <p class="eyebrow">Trust, quickly</p>
          <h2>Not precious. Not fake-casual.</h2>
          <p>Ceremonial grade, domestically grown, and priced for the daily cup.</p>
        </article>
        <article class="trust-card">
          <img class="trust-mascot trust-mascot-cat" src="assets/Big_Cat.png" alt="Big cat mascot" />
          <div class="component-badge stamp-badge" aria-hidden="true">5 min<br />ritual</div>
          <p class="eyebrow">Kitchen ritual</p>
          <h2>Five minutes can have a plot.</h2>
          <p>Scoop, whisk, sip, repeat. A small ritual with a lively cast.</p>
        </article>
      </div>
    </section>

    <div class="panel-seam" aria-hidden="true"></div>

    <section class="section butter-band">
      <div class="shape-cluster review-shapes" aria-hidden="true">
        <span class="shape shape-checker"></span>
        <span class="shape shape-ring"></span>
        <span class="shape shape-diamond"></span>
      </div>
      <div class="section-head">
        <div>
          <p class="eyebrow">Counter talk</p>
          <h2>Daily drinkers, not actors.</h2>
        </div>
      </div>
      <div class="review-grid">${featuredReviews()}</div>
      <div class="reaction-bar" aria-hidden="true">
        <span>Like</span>
        <span>Save</span>
        <span>Whisk</span>
        <span>Daily</span>
      </div>
    </section>
  `;
}

function renderShop() {
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Shop all</p>
          <h1>Every tin on the counter.</h1>
        </div>
        <p>Search by character, flavor, or mood. The family will try not to rearrange itself while you browse.</p>
      </div>
      <div class="shop-layout">
        <div class="shop-callout">
          <span class="mini-face" aria-hidden="true">F</span>
          <p>Frankie filed these by flavor, format, and daily-use logic.</p>
        </div>
        <div class="catalog-heading-row">
          <div class="shop-tabs" aria-hidden="true">
            <span>All tins</span>
            <span>Latte</span>
            <span>Ritual</span>
          </div>
          <p class="catalog-count"><strong id="catalogCount">${products.length}</strong> counter goods</p>
        </div>
        <form class="filter-bar" id="filterForm">
          <label class="sr-only" for="searchInput">Search products</label>
          <input id="searchInput" type="search" placeholder="Search flavor, Furbert, or ritual..." />
          <label class="sr-only" for="flavorFilter">Filter by flavor</label>
          <select id="flavorFilter">
            <option value="">All flavors</option>
            ${[...new Set(products.map((product) => product.flavor))]
              .map((flavor) => `<option value="${flavor}">${flavor}</option>`)
              .join("")}
          </select>
          <button type="submit">Filter</button>
        </form>
        <div id="shopGrid" class="product-grid catalog-grid"></div>
      </div>
    </section>
  `;
  const form = document.querySelector("#filterForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateShopGrid();
  });
  form.addEventListener("input", updateShopGrid);
  updateShopGrid();
}

function updateShopGrid() {
  const query = document.querySelector("#searchInput").value.toLowerCase();
  const flavor = document.querySelector("#flavorFilter").value;
  const matches = products.filter((product) => {
    const haystack = `${product.name} ${product.flavor} ${product.character} ${product.mood} ${product.tags.join(" ")}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!flavor || product.flavor === flavor);
  });
  const count = document.querySelector("#catalogCount");
  if (count) count.textContent = matches.length;
  document.querySelector("#shopGrid").innerHTML = matches.length
    ? matches.map(productCard).join("")
    : `<p class="empty-state">No tins found. Try another flavor, character, or ritual note.</p>`;
}

function renderProduct(id) {
  const product = products.find((item) => item.id === id) || products[0];
  const reviews = [...product.reviews, ...(addedReviews[product.id] || [])];
  app.innerHTML = `
    <section class="section product-detail">
      <div class="product-stage">
        ${productImage(product, true)}
        ${mascot(product.character, "one")}
      </div>
      <div class="detail-info">
        <p class="eyebrow">${product.character} presents</p>
        <h1>${product.name}</h1>
        <p class="price"><span class="price-tag-lg">${money(product.price)}</span></p>
        <p>${product.notes}</p>
        <div class="tag-row">${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        <button class="primary-action" type="button" data-add="${product.id}">Add to cart</button>
        <a class="secondary-action" href="#shop">Back to shop</a>
      </div>
    </section>
    <section class="section butter-band">
      <div class="section-head">
        <div>
          <p class="eyebrow">Reviews</p>
          <h2>What the counter says.</h2>
        </div>
      </div>
      <div class="review-grid">
        ${reviews
          .map(
            ([name, quote]) => `
          <article class="review speech-bubble">
            <strong><span class="review-avatar" aria-hidden="true">${name.trim()[0]}</span>${name}</strong>
            <p>"${quote}"</p>
          </article>
        `
          )
          .join("")}
      </div>
      <form class="add-review" id="reviewForm">
        <h3>Add a review</h3>
        <input id="reviewName" required placeholder="Your name" />
        <textarea id="reviewText" required placeholder="What did this tin do to your morning?"></textarea>
        <button type="submit">Post review</button>
        <p id="reviewMessage" class="form-message" role="status"></p>
      </form>
    </section>
  `;
  document.querySelector("#reviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#reviewName").value.trim();
    const text = document.querySelector("#reviewText").value.trim();
    if (!name || !text) return;
    addedReviews[product.id] = [...(addedReviews[product.id] || []), [name, text]];
    localStorage.setItem("furbertsReviews", JSON.stringify(addedReviews));
    document.querySelector("#reviewMessage").textContent = "Review posted. The family is pretending to be normal about it.";
    renderProduct(product.id);
  });
}

function renderAbout() {
  app.innerHTML = `
    <section class="about-playbill">
      <div class="about-ribbon">
        <span>Imagination</span>
        <span>Joy</span>
        <span>Family</span>
      </div>
      <div class="about-logo-stage">
        <img class="about-mascot about-mascot-ly" src="assets/Ly.png" alt="Ly Furbert mascot" />
        <div class="about-logo-copy">
          <p class="eyebrow">About us</p>
          <h1>A matcha habit turned family lore.</h1>
        </div>
        <img class="about-mascot about-mascot-cat" src="assets/Small_Cat.png" alt="Small cat mascot" />
      </div>
      <div class="about-intro-grid">
        <article class="about-story-panel">
          <h2>Bringing ritual to every cup.</h2>
          <p>
            Furberts' Matcha started as a hobby: better cups at home, better ingredients, fewer excuses to overpay.
            Then the founders gave the ritual a recurring cast. The Furberts came from that habit.
          </p>
        </article>
        <aside class="founder-card">
          <span class="founder-label">Founder</span>
          <img src="assets/Ly.png" alt="Ly Furbert mascot" />
          <strong>Ly Furbert</strong>
        </aside>
      </div>
    </section>

    <section class="about-family-band">
      <div class="featured-family">
        <img src="assets/Mom-v2.png" alt="Mom Furbert mascot" />
        <strong>Meet the Furberts</strong>
      </div>
      <div class="mascot-orbit" aria-label="Furberts mascot lineup">
        <img src="assets/Brother-v2.png" alt="Brother Furbert mascot" />
        <img src="assets/Sister-v2.png" alt="Sister Furbert mascot" />
        <img src="assets/Ly.png" alt="Ly Furbert mascot" />
        <img src="assets/Dad-v2.png" alt="Dad Furbert mascot" />
        <img src="assets/Big_Cat.png" alt="Big cat mascot" />
        <img src="assets/Small_Cat.png" alt="Small cat mascot" />
      </div>
      <div class="about-family-copy">
        <h2>Our lovely matcha household</h2>
        <p>Most matcha brands whisper. Furberts gives every flavor a recognizable house member, creating memory without hiding the quality story.</p>
        <a class="secondary-action" href="#shop">Discover them all</a>
      </div>
    </section>

    <section class="about-lab-section">
      <article class="research-card">
        <h2>Our ritual program</h2>
        <p>
          The audience already drinks matcha. They know the ritual, the price creep, and the disappointment of bland powder.
          Furberts is built around a domestic supply story and a price that makes repeat cups realistic.
        </p>
      </article>
      <img class="about-wave" src="assets/Big_Cat.png" alt="Big cat mascot" />
      <article class="world-card">
        <p class="eyebrow">Family notes</p>
        <h2>Messy on purpose, clear where it counts.</h2>
        <p>The world can feel archived, animated, and a little odd. Ingredients, product pages, cart, and checkout stay clear.</p>
      </article>
    </section>
  `;
}

function renderCheckout() {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Checkout</p>
          <h1>Send it to the counter.</h1>
        </div>
      </div>
      <div class="checkout-grid">
        <form class="checkout-card" id="checkoutForm">
          <h2>Details</h2>
          <input required placeholder="Full name" />
          <input required type="email" placeholder="Email" />
          <input required placeholder="Shipping address" />
          <select required>
            <option value="">Payment method</option>
            <option>Card ending in later</option>
            <option>Invoice on delivery</option>
          </select>
          <button class="primary-action" type="submit">Place order</button>
          <p id="checkoutMessage" class="form-message" role="status"></p>
        </form>
        <aside class="checkout-card">
          <span class="mini-face" aria-hidden="true">M</span>
          <h2>Order stack</h2>
          <div class="line-items">
            ${
              cart.length
                ? cart
                    .map((item) => {
                      const product = products.find((candidate) => candidate.id === item.id);
                      return `<div class="line-item"><span>${product.name} x ${item.qty}</span><strong>${money(product.price * item.qty)}</strong></div>`;
                    })
                    .join("")
            : `<p>Your cart is empty. Add a tin when you are ready.</p>`
            }
          </div>
          <div class="line-item"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
        </aside>
      </div>
    </section>
  `;
  document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#checkoutMessage").textContent = cart.length
      ? "Order placed. Mabel is labeling the imaginary box."
      : "Add a tin first so the family has something to argue about.";
    if (cart.length) {
      cart = [];
      saveCart();
    }
  });
}

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
}

function changeQty(id, delta) {
  cart = cart
    .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
    .filter((item) => item.qty > 0);
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  cartCount.textContent = totalItems;
  cartSubtotal.textContent = money(subtotal);
  cartItems.innerHTML = cart.length
    ? cart
        .map((item) => {
          const product = products.find((candidate) => candidate.id === item.id);
          return `
            <article class="cart-item">
              <div>
                <strong>${product.name}</strong>
                <p>${money(product.price)} each</p>
                <div class="qty-controls">
                  <button class="qty-button" type="button" data-qty="${product.id}" data-delta="-1">-</button>
                  <span>${item.qty}</span>
                  <button class="qty-button" type="button" data-qty="${product.id}" data-delta="1">+</button>
                </div>
              </div>
              <strong>${money(product.price * item.qty)}</strong>
            </article>
          `;
        })
        .join("")
    : `<p class="empty-state">No tins yet. Add a product to begin checkout.</p>`;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function route() {
  const hash = location.hash || "#home";
  const [page, id] = hash.replace("#", "").split("/");
  document.body.dataset.page = page || "home";
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  closeCart();
  if (page === "shop") renderShop();
  else if (page === "product") renderProduct(id);
  else if (page === "about") renderAbout();
  else if (page === "checkout") renderCheckout();
  else renderHome();
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkPage = link.getAttribute("href").replace("#", "");
    const current = (page === "product" ? "shop" : page || "home") === linkPage;
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const qtyButton = event.target.closest("[data-qty]");
  if (qtyButton) changeQty(qtyButton.dataset.qty, Number(qtyButton.dataset.delta));
});

document.querySelector(".cart-button").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletterEmail").value.trim();
  document.querySelector("#newsletterMessage").textContent = email
    ? "You're on the bulletin. Tessie logged the note."
    : "";
  event.currentTarget.reset();
});

window.addEventListener("hashchange", route);
renderCart();
route();
