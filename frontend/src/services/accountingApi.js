const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function createBankReceipt(data) {
  await delay();
  return { id: 'BR-' + Date.now(), ...data };
}

export async function createCashReceipt(data) {
  await delay();
  return { id: 'CR-' + Date.now(), ...data };
}

export async function createCustomerPayment(data) {
  await delay();
  return { id: 'CP-' + Date.now(), ...data };
}

export async function createSupplierAdvance(data) {
  await delay();
  return { id: 'SA-' + Date.now(), ...data };
}

export async function createSupplierPayment(data) {
  await delay();
  return { id: 'SP-' + Date.now(), ...data };
}
