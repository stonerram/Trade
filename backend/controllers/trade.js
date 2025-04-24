const axios = require("axios");
const Trade = require("../models/trade");

const cleanNumber = (value) => {
  if (typeof value === "string") {
    return parseFloat(value.replace(/,/g, ""));
  }
  return parseFloat(value);
};

const evaluateTrade = async (req, res) => {
  try {
    const {
      product_name,
      quantity,
      source_currency,
      destination_currency,
      cost_price,
      selling_price,
      trade_type,
    } = req.body;

    const clean_quantity = parseInt(quantity);
    const clean_cost_price = cleanNumber(cost_price);
    const clean_selling_price = cleanNumber(selling_price);

    if (
      !product_name ||
      isNaN(clean_quantity) ||
      isNaN(clean_cost_price) ||
      isNaN(clean_selling_price)
    ) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    const conversionRes = await axios.get(
      `https://api.exchangerate.host/convert?from=${source_currency}&to=${destination_currency}&amount=${clean_cost_price * clean_quantity}`
    );

    const converted_cost_total = conversionRes.data.result || 0;

    let discount = 0;
    if (clean_quantity > 1000) discount = 10;
    else if (clean_quantity > 500) discount = 5;

    const discount_amount = (converted_cost_total * discount) / 100;
    const total_cost = converted_cost_total - discount_amount;

    const revenue = clean_selling_price * clean_quantity;
    const profit = revenue - total_cost;
    const margin_percent = total_cost > 0 ? (profit / total_cost) * 100 : 0;

    let profit_tag = "❌ Loss";
    if (margin_percent > 0 && margin_percent <= 10) profit_tag = "⚠️ Low Margin";
    else if (margin_percent > 10 && margin_percent <= 30) profit_tag = "✅ Medium Margin";
    else if (margin_percent > 30) profit_tag = "💰 High Margin";

    const trade = new Trade({
      product_name,
      quantity: clean_quantity,
      source_currency,
      destination_currency,
      cost_price: clean_cost_price,
      selling_price: clean_selling_price,
      converted_cost: parseFloat((converted_cost_total / clean_quantity).toFixed(2)) || 0,
      discount,
      profit: parseFloat(profit.toFixed(2)) || 0,
      margin_percent: parseFloat(margin_percent.toFixed(2)) || 0,
      profit_tag,
      trade_type,
      trade_date: new Date(),
    });

    await trade.save();
    res.status(200).json(trade);
  } catch (err) {
    console.error("Error evaluating trade:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { evaluateTrade };
