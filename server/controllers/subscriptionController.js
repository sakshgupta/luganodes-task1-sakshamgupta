const User = require("../models/user");
const axios = require("axios");

const { dailyNotificationEmail } = require("./emailController");

async function fetchData() {
  try {
    const url = `${process.env.COIN_API_URL}`;
    const response = await axios.get(url);

    return response.data; // Display the fetched data
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const dailyUpdate = async (req, res) => {
  try {
    const data = await fetchData();
    const users = await User.find({}).exec();

    const promises = users.map(async (userData) => {
      console.log(userData.name);
      let userName = userData.name;
      let userEmail = userData.email;
      let currencyDetails = [];

      for (const currency of userData.subscribed) {
        const Id = currency.currencyID;

        const currencyInfo = data.find(
          (currencyInfo) => currencyInfo.id === Id
        );
        if (currencyInfo) {
          currencyDetails.push(currencyInfo);
        }
      }

      //sending email
      if(currencyDetails.length != 0){
        dailyNotificationEmail(userName, userEmail, currencyDetails);
      }

      return true;
    });

    await Promise.all(promises);

    res
      .status(200)
      .json({ success: true, message: "Daily update completed successfully." });
  } catch (error) {
    console.error("Error in dailyUpdate:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during daily update.",
    });
  }
};

const subscribeCurrency = async (req, res) => {
  const { userId, currencyId } = req.body;

  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.subscribed.includes(currencyId)) {
      return res.status(409).json({ message: "Currency already subscribed by the user." });
    }

    const existingCurrency = user.subscribed.find((currency) => currency.currencyId === currencyId);

    if (!existingCurrency) {
      user.subscribed.push({ currencyId });
      const updatedUser = await user.save();

      return res
        .status(200)
        .json({
          message: "Currency subscribed successfully.",
          user: updatedUser,
        });
    } else {
      return res.status(409).json({ message: "Currency already subscribed by the user." });
    }
  } catch (error) {
    console.error("Error during currency subscription:", error);
    return res
      .status(500)
      .json({ message: "Internal server error." });
  }
};


const removeSubscription = async (req, res) => {
  const {userId, currencyId} = req.body;
  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const currencyIndex = user.subscribed.findIndex((subscribe) => subscribe.currencyId === currencyId);

    if (currencyIndex !== -1) {
      user.subscribed.splice(currencyIndex, 1);
      const updatedUser = await user.save();

      return res.status(200).json({
        message: 'Currency subscribe deleted successfully.',
        user: updatedUser,
      });
    } else {
      return res.status(404).json({ message: 'Currency subscribe not found.' });
    }
  } catch (error) {
    console.error('Error deleting currency subscribe:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}

module.exports = {
  dailyUpdate,
  subscribeCurrency,
  removeSubscription
};
