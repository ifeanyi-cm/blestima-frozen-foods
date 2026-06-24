const axios = require("axios");

async function publishToFacebook(content) {

  try {

    const pageId =
      process.env.FACEBOOK_PAGE_ID;

    const accessToken =
      process.env.FACEBOOK_ACCESS_TOKEN;

    /*
    |--------------------------------------------------------------------------
    | TEMP MOCK MODE
    |--------------------------------------------------------------------------
    */

    if (!pageId || !accessToken) {

      console.log("Facebook credentials not set");

      console.log(content);

      return {
        success: true,
        postId: "mock_facebook_post",
      };
    }

    /*
    |--------------------------------------------------------------------------
    | REAL META GRAPH API
    |--------------------------------------------------------------------------
    */

    const response =
      await axios.post(

        `https://graph.facebook.com/v19.0/${pageId}/feed`,

        {
          message: content,
          access_token: accessToken,
        }
      );

    console.log("Posted to Facebook ✅");

    return {
      success: true,
      postId: response.data.id,
    };

  } catch (error) {

    console.error(
      "Facebook Post Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
    };
  }
}

module.exports = {
  publishToFacebook,
};