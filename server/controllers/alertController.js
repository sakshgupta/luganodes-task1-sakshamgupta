const User = require("../models/user");
const axios = require("axios");

const { limitNotifications } = require("./emailController");

const setLimit = async (req, res) => {
  const { userId, currencyId, lower_bound, upper_bound } = req.body;

  try {
    // Find the user with the given userId
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the currencyId already exists in the 'limits' array
    const existingCurrency = user.limits.find(
      (limit) => limit.currencyId === currencyId
    );

    if (!existingCurrency) {
      // If the currencyId does not exist, then add it to the 'limits' array
      user.limits.push({ currencyId, lower_bound, upper_bound });
      const updatedUser = await user.save();

      return res.status(200).json({
        message: "Limits set successfully.",
        user: updatedUser,
      });
    } else {
      // If the currencyId already exists, update the lower_bound and upper_bound
      existingCurrency.lower_bound = lower_bound;
      existingCurrency.upper_bound = upper_bound;
      const updatedUser = await user.save();

      return res.status(200).json({
        message: "Limits updated successfully.",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.error("Error setting limits:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

async function fetchData() {
  try {
    const url = `${process.env.COIN_API_URL}`;
    const response = await axios.get(url);

    return response.data; // Display the fetched data
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const checkLimit = async (req, res) => {
  try {
    const data = await fetchData();
    const users = await User.find({}).exec();

    const promises = users.map(async (userData) => {

      let userName = userData.name;
      let userEmail = userData.email;

      for (const currency of userData.limits) {
          const Id = currency.currencyId;
          console.log(currency.currencyId);
          console.log(currency.upper_bound);
          console.log(currency.lower_bound);
          
          
          const currencyInfo = data.find((currencyInfo) => currencyInfo.id === Id);
        
           console.log(currencyInfo.current_price);
              
        if (currencyInfo.current_price > currency.upper_bound || currencyInfo.current_price < currency.lower_bound) {
            console.log("Urgent: have a look your currency moved out of limit");
            console.log("Upper limit: ", currency.upper_bound);
            console.log("Lower limit: ", currency.lower_bound);
            console.log("Current price: ", currencyInfo.current_price);

            // sending email
            limitNotifications(userName, userEmail, currency.upper_bound, currency.lower_bound, currencyInfo.current_price, currency.currencyId);

            console.log("Sending email: limit crossed");
        }

      }


      return true;
    });

    await Promise.all(promises);

    res
      .status(200)
      .json({ success: true, message: "Limits checked successfully." });
  } catch (error) {
    console.error("Error in limit check:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during limit check.",
    });
  }
};


const deleteLimit = async (req, res) => {
  const { userId, currencyId } = req.body;

  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const currencyIndex = user.limits.findIndex((limit) => limit.currencyId === currencyId);

    if (currencyIndex !== -1) {
      user.limits.splice(currencyIndex, 1);
      const updatedUser = await user.save();

      return res.status(200).json({
        message: 'Currency limit deleted successfully.',
        user: updatedUser,
      });
    } else {
      return res.status(404).json({ message: 'Currency limit not found.' });
    }
  } catch (error) {
    console.error('Error deleting currency limit:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

module.exports = {
  setLimit,
  checkLimit,
  deleteLimit
};
