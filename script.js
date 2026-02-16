const state = {
  day: 1,
  cash: 1000,
  oilStock: 0,
  capacity: 50,
  pumpLevel: 1,
  price: 20,
  storageUpgradeCost: 400,
  pumpUpgradeCost: 500,
};

const el = {
  day: document.getElementById('day'),
  cash: document.getElementById('cash'),
  oilStock: document.getElementById('oilStock'),
  capacity: document.getElementById('capacity'),
  pumpLevel: document.getElementById('pumpLevel'),
  price: document.getElementById('price'),
  qty: document.getElementById('qty'),
  marketHint: document.getElementById('marketHint'),
  storageCost: document.getElementById('storageCost'),
  pumpCost: document.getElementById('pumpCost'),
  log: document.getElementById('log'),
  buyBtn: document.getElementById('buyBtn'),
  sellBtn: document.getElementById('sellBtn'),
  nextDayBtn: document.getElementById('nextDayBtn'),
  pumpBtn: document.getElementById('pumpBtn'),
  storageBtn: document.getElementById('storageBtn'),
  pumpUpgradeBtn: document.getElementById('pumpUpgradeBtn'),
};

function formatMoney(value) {
  return `$${value.toLocaleString()}`;
}

function addLog(message, good = false) {
  const item = document.createElement('li');
  item.textContent = `[Day ${state.day}] ${message}`;
  if (good) item.classList.add('good');
  el.log.prepend(item);
}

function randomPrice(base) {
  const volatility = Math.floor(Math.random() * 13) - 6;
  return Math.max(5, base + volatility);
}

function updateUi() {
  el.day.textContent = state.day;
  el.cash.textContent = formatMoney(state.cash);
  el.oilStock.textContent = state.oilStock;
  el.capacity.textContent = state.capacity;
  el.pumpLevel.textContent = state.pumpLevel;
  el.price.textContent = formatMoney(state.price);
  el.storageCost.textContent = formatMoney(state.storageUpgradeCost);
  el.pumpCost.textContent = formatMoney(state.pumpUpgradeCost);
}

function getQty() {
  const qty = Number.parseInt(el.qty.value, 10);
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
}

function buyOil() {
  const qty = getQty();
  const cost = qty * state.price;

  if (state.oilStock + qty > state.capacity) {
    addLog('Storage is full. Upgrade storage in the shop.');
    return;
  }

  if (state.cash < cost) {
    addLog('Not enough cash to buy that much oil.');
    return;
  }

  state.cash -= cost;
  state.oilStock += qty;
  addLog(`Bought ${qty} oil for ${formatMoney(cost)}.`);
  updateUi();
}

function sellOil() {
  const qty = getQty();
  if (state.oilStock < qty) {
    addLog('You do not have enough oil to sell.');
    return;
  }

  const revenue = qty * state.price;
  state.oilStock -= qty;
  state.cash += revenue;
  addLog(`Sold ${qty} oil for ${formatMoney(revenue)}.`, true);
  updateUi();
}

function nextDay() {
  state.day += 1;
  const oldPrice = state.price;
  state.price = randomPrice(state.price);
  const trend = state.price > oldPrice ? 'up' : state.price < oldPrice ? 'down' : 'flat';
  el.marketHint.textContent = `Price moved ${trend}: ${formatMoney(oldPrice)} → ${formatMoney(state.price)}`;
  addLog(`A new day begins. Market price is now ${formatMoney(state.price)}.`);
  updateUi();
}

function pumpOil() {
  const produced = state.pumpLevel * 2;
  const space = state.capacity - state.oilStock;
  const actual = Math.min(space, produced);

  if (actual <= 0) {
    addLog('No storage space left. Sell oil or buy more storage.');
    return;
  }

  state.oilStock += actual;
  addLog(`Pumped ${actual} oil from your field.`);
  updateUi();
}

function upgradeStorage() {
  if (state.cash < state.storageUpgradeCost) {
    addLog('Not enough cash for storage upgrade.');
    return;
  }

  state.cash -= state.storageUpgradeCost;
  state.capacity += 25;
  state.storageUpgradeCost = Math.floor(state.storageUpgradeCost * 1.6);
  addLog('Storage upgraded by +25 capacity.', true);
  updateUi();
}

function upgradePump() {
  if (state.cash < state.pumpUpgradeCost) {
    addLog('Not enough cash for pump upgrade.');
    return;
  }

  state.cash -= state.pumpUpgradeCost;
  state.pumpLevel += 1;
  state.pumpUpgradeCost = Math.floor(state.pumpUpgradeCost * 1.7);
  addLog('Pump upgraded! Production increased.', true);
  updateUi();
}

el.buyBtn.addEventListener('click', buyOil);
el.sellBtn.addEventListener('click', sellOil);
el.nextDayBtn.addEventListener('click', nextDay);
el.pumpBtn.addEventListener('click', pumpOil);
el.storageBtn.addEventListener('click', upgradeStorage);
el.pumpUpgradeBtn.addEventListener('click', upgradePump);

updateUi();
addLog('Welcome to Oil Game. Buy low, sell high, and expand your business!');
