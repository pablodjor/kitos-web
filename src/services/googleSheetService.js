const scriptUrl = process.env.REACT_APP_SCRIPT_URL;

export async function registerUser({ name, email }) {
  if (!scriptUrl) {
    throw new Error("Falta configurar REACT_APP_SCRIPT_URL en el .env");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({
      action: "register",
      name,
      email,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.message || "Error al registrar");
  }

  return data;
}

export async function redeemCode({ email, code }) {
  if (!scriptUrl) {
    throw new Error("Falta configurar REACT_APP_SCRIPT_URL en el .env");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({
      action: "redeemCode",
      email,
      code,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.message || "Error al cargar el código");
  }

  return data;
}

export async function getOffers() {
  if (!scriptUrl) {
    throw new Error("Falta configurar REACT_APP_SCRIPT_URL en el .env");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({
      action: "getOffers",
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.message || "Error al traer ofertas");
  }

  return data.offers || [];
}


export async function getRaffleConfig() {
  if (!scriptUrl) {
    throw new Error("Falta configurar REACT_APP_SCRIPT_URL en el .env");
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({
      action: "getRaffleConfig",
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.message || "Error al traer configuración del sorteo");
  }

  return data.config;
}