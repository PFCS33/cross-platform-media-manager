async function fetchAuthData(url, data, context) {
  try {
    context.commit("setLoading", true);
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    context.commit("setError", {
      state: false,
      message: "",
      mode: mode,
    });
    context.commit("setLoading", false);
    context.dispatch("handleData", responseData);
  } catch (error) {
    context.commit("setError", {
      state: true,
      message: error.message,
      mode: mode,
    });
    context.commit("setLoading", false);
    console.error("error:", error.message);
  }
}

async function fetchAuthorizeData(url, data, context) {
  try {
    context.commit("setLoading", true);
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message);
    } else {
      context.commit("setError", {
        state: false,
        message: responseData.message ? responseData.message : "load succeeded",
      });
      context.commit("setLoading", false);
      console.log(responseData);
      // TODO handle response data
      //   context.dispatch("handleData", responseData);
    }
  } catch (error) {
    context.commit("setError", {
      state: true,
      message: error.message,
    });
    context.commit("setLoading", false);
    console.error("error:", error.message);
  }
}

export { fetchAuthData, fetchAuthorizeData };
