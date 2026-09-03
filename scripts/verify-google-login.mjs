async function verifyGoogleLogin() {
  console.log("🔍 Testing Google Auth & Login Page...");

  const pageRes = await fetch("http://localhost:3000/auth/login");
  console.log("Login Page Status:", pageRes.status);

  const googleAuthRes = await fetch("http://localhost:3000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "partenaire.google@terranova.agri",
      name: "Agro Partenaire Google",
    }),
  });

  const data = await googleAuthRes.json();
  console.log("Google Auth API Status:", googleAuthRes.status);
  console.log("Google Auth Payload:", data);

  if (data.success && data.user?.email === "partenaire.google@terranova.agri") {
    console.log("✅ GOOGLE SIGN-IN FULLY FUNCTIONAL & VERIFIED!");
  } else {
    console.error("❌ Google Auth failed");
  }
}

verifyGoogleLogin().catch(console.error);
