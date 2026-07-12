const store = new Map();

function getCached(key, ttlMs){
  const entry = store.get(key);
  if(entry && (Date.now() - entry.time) < ttlMs) return entry.value;
  return null;
}

function setCached(key, value){
  store.set(key, {value, time: Date.now()});
}

module.exports = { getCached, setCached };
