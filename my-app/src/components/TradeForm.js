import { useState } from "react";
import axios from "axios";

const TradeForm = () => {
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    source_currency: "INR",
    destination_currency: "USD",
    cost_price: "",
    selling_price: "",
    trade_type: "Export",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      "http://localhost:5000/api/trade/evaluate",
      form
    );
    setResult(data);
  };

  return (
    <div className="trade-form-container">
    

      <h2>Trade Evaluator</h2>
      <form className="trade-form" onSubmit={handleSubmit}>
        <input
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
        <select
          name="source_currency"
          value={form.source_currency}
          onChange={handleChange}
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <select
          name="destination_currency"
          value={form.destination_currency}
          onChange={handleChange}
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
        <input
          name="cost_price"
          value={form.cost_price}
          onChange={handleChange}
          placeholder="Cost Price"
        />
        <input
          name="selling_price"
          value={form.selling_price}
          onChange={handleChange}
          placeholder="Selling Price"
        />
        <select
          name="trade_type"
          value={form.trade_type}
          onChange={handleChange}
        >
          <option value="Export">Export</option>
          <option value="Import">Import</option>
        </select>
        <button type="submit">Evaluate</button>
      </form>

      {result && (
        <div className="result-box">
          <p>
            <b>Profit:</b> {result.profit}
          </p>
          <p>
            <b>Margin %:</b> {result.margin_percent}
          </p>
          <p>
            <b>Tag:</b> {result.profit_tag}
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeForm;
