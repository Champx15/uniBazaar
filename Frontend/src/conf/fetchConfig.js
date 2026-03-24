const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const res = await originalFetch(...args);

  console.log("STATUS:", res.status); 

  if (res.status === 403) {
    let isBanned = false;

    try {
      const data = await res.clone().json();
      console.log("403 DATA:", data); 

      if (data?.code === "USER_BANNED") {
        isBanned = true;
      }
    } catch (e) {
      console.log("JSON parse failed"); 
    }

    if (isBanned && window.location.pathname !== "/banned") {
      window.location.href = "/banned";
    }
  }

  return res;
};