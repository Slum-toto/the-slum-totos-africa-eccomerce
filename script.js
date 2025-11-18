// Main script for Slumtotos-Africa (v2)
const products = [
  { id:1, name:"kaftan shirt", category:"Kente", price:4500, image:"images/dad 1.jpg", rating:4, isNew:true },
  { id:2, name:"Oga shirt", category:"Agbada", price:7000, image:"images/dad 2.jpg", rating:5, isNew:true },
  { id:3, name:"west african dress", category:"Ankara", price:3200, image:"images/martin 3.jpg ", rating:4, isNew:true },
  { id:4, name:"kids west african shirt", category:"Ankara", price:2800, image:"images/martin 2.jpg", rating:3 },
  { id:5, name:"African Hoodie", category:"Casual", price:2500, image:"images/mama 2.jpg", rating:4 },
  { id:6, name:"Printed Tee", category:"Casual", price:1200, image:"images/mama 1.jpg", rating:3 },
  { id:7, name:"Blue Agbada Jacket", category:"Agbada", price:7000, image:"images/dad 50.jpg", rating:5 },
  { id:8, name:"Agbada Pattern Shirt", category:"Agbada", price:6500, image:"https://i.pinimg.com/736x/30/2b/a0/302ba05ccefffcc0a5b391c3bc3ad311.jpg", rating:4 },
  { id:9, name:"Kente Scarf", category:"Kente", price:1500, image:"https://i.pinimg.com/736x/22/25/46/22254673f4ff915f5d6abc9f04cfa948.jpg", rating:4 }
];

let cart = JSON.parse(localStorage.getItem('st_cart') || '[]');
let filteredProducts = [...products];

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(filteredProducts);
  updateCart();
  setupSearch();
  setupCartControls();
  setupFilters();
  setupGotoCheckout();
});

function saveCart(){ localStorage.setItem('st_cart', JSON.stringify(cart)); }

function renderProducts(list){
  const container = document.getElementById('product-list');
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x300?text=Image+not+found'">
        ${p.isNew ? '<div class="badge">NEW</div>' : ''}
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <div class="rating">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
        <div class="price">KES ${p.price.toFixed(0)}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addToCart(id){
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.quantity = (existing.quantity||1)+1; } else { const prod = products.find(p=>p.id===id); if(prod) cart.push({...prod, quantity:1}); }
  saveCart(); updateCart();
}

function removeFromCart(id){ cart = cart.filter(i=>i.id!==id); saveCart(); updateCart(); }

function updateCart(){
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if(countEl) countEl.textContent = cart.reduce((s,i)=>s + (i.quantity||0),0);
  if(itemsEl) itemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += (item.price || 0) * (item.quantity || 0);
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${item.name}</div>
        <div style="font-size:0.9rem">Qty: ${item.quantity}</div>
      </div>
      <div style="text-align:right">
        <div>KES ${(item.price * item.quantity).toFixed(0)}</div>
        <button onclick="removeFromCart(${item.id})" style="margin-top:6px;padding:6px;border-radius:6px;border:none;background:#e53e3e;color:#fff">Remove</button>
      </div>
    `;
    itemsEl.appendChild(div);
  });
  if(totalEl) totalEl.textContent = 'KES ' + total.toFixed(0);
}

function setupCartControls(){
  const openBtn = document.querySelector('.cart-display');
  const closeBtn = document.getElementById('close-cart');
  const sidebar = document.getElementById('cart-sidebar');
  if(openBtn) openBtn.addEventListener('click', ()=> toggleCart(true));
  if(closeBtn) closeBtn.addEventListener('click', ()=> toggleCart(false));
  document.addEventListener('click', (e)=>{ if(!sidebar) return; if(sidebar.classList.contains('open') && !sidebar.contains(e.target) && !e.target.closest('.cart-display')) toggleCart(false); });
}

function toggleCart(show){ const sidebar = document.getElementById('cart-sidebar'); if(!sidebar) return; sidebar.classList.toggle('open', !!show); sidebar.setAttribute('aria-hidden', (!show).toString()); }

function setupSearch(){ const input = document.getElementById('search'); if(!input) return; input.addEventListener('input', ()=>{ const q = input.value.trim().toLowerCase(); const results = filteredProducts.filter(p => (p.name||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q)); renderProducts(results); }); }

function setupFilters(){ document.querySelectorAll('#category-filters button').forEach(btn=>{ btn.addEventListener('click', ()=>{ const cat = btn.getAttribute('data-cat'); if(cat === 'All') filteredProducts = [...products]; else filteredProducts = products.filter(p => p.category === cat); document.getElementById('search').value = ''; renderProducts(filteredProducts); }); }); }

function setupGotoCheckout(){ const goto = document.getElementById('goto-checkout'); if(goto) goto.addEventListener('click', ()=> { toggleCart(false); }); }

// expose functions used inline
window.removeFromCart = removeFromCart; window.addToCart = addToCart;
