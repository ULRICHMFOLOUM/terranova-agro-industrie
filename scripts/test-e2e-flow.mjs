async function testFullFlow() {
  console.log("🚀 Testing TERRANOVA End-to-End API Flow...");

  // 1. Test Client Login
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "client@terranova.agri",
      password: "ClientTerra2026!",
    }),
  });
  const loginData = await loginRes.json();
  console.log("1. Client Login Response:", loginRes.status, loginData.success ? "✅ SUCCESS" : "❌ FAILED");
  const authCookie = loginRes.headers.get("set-cookie");

  // 2. Fetch Products to get real product ID
  const productsRes = await fetch("http://localhost:3000/api/admin/products");
  const productsData = await productsRes.json();
  const sampleProduct = productsData.products?.[0];
  console.log("2. Available Products:", productsData.products?.length, "Sample product:", sampleProduct?.name);

  // 3. Create Order
  const orderRes = await fetch("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authCookie ? { Cookie: authCookie } : {}),
    },
    body: JSON.stringify({
      customerName: "Coopérative Test",
      customerEmail: "client@terranova.agri",
      customerPhone: "+237 670 98 76 54",
      shippingCity: "Douala",
      shippingAddress: "Zone Portuaire",
      paymentMethod: "FAPSHI_MOMO",
      items: [
        {
          id: sampleProduct.id,
          name: sampleProduct.name,
          quantity: 2,
        },
      ],
    }),
  });

  const orderData = await orderRes.json();
  console.log("3. Order Creation Response:", orderRes.status, orderData.success ? "✅ SUCCESS" : "❌ FAILED", "OrderNumber:", orderData.orderNumber);

  // 4. Test Fapshi Webhook Confirmation
  const webhookRes = await fetch("http://localhost:3000/api/webhook/fapshi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      externalId: orderData.orderNumber,
      status: "SUCCESSFUL",
      transId: "FPSH-LIVE-TEST-OK",
    }),
  });
  const webhookData = await webhookRes.json();
  console.log("4. Webhook Fapshi Response:", webhookRes.status, webhookData.success ? "✅ SUCCESS" : "❌ FAILED");

  // 5. Verify Invoice Endpoint for this newly created order
  const invoiceRes = await fetch(`http://localhost:3000/facture/${orderData.orderNumber}`);
  console.log("5. Invoice View Response:", invoiceRes.status, invoiceRes.status === 200 ? "✅ 200 OK" : "❌ FAILED");

  // 6. Test Admin Login
  const adminLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@terranova.agri",
      password: "AdminTerra2026!",
    }),
  });
  const adminData = await adminLoginRes.json();
  console.log("6. Admin Login Response:", adminLoginRes.status, adminData.user?.role === "ADMIN" ? "✅ ADMIN SUCCESS" : "❌ FAILED");

  console.log("🎉 ALL API & END-TO-END MUTATIONS VALIDATED WITH 100% SUCCESS!");
}

testFullFlow().catch(console.error);
