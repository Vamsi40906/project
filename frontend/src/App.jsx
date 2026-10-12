import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });

  const load = async () => {
    const res = await axios.get(`${API}/expenses`);
    setExpenses(res.data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;
    await axios.post(`${API}/expenses`, { ...form, amount: parseFloat(form.amount) });
    setForm({ title: "", amount: "", category: "", date: "" });
    load();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/expenses/${id}`);
    load();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Expense Tracker</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Title" value={form.title}
               onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Amount" type="number" value={form.amount}
               onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category" value={form.category}
               onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="date" value={form.date}
               onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <button onClick={add}>Add</button>
      </div>

      <h3>Total: ₹{total.toFixed(2)}</h3>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.date} | {e.title} | {e.category} | ₹{e.amount}{" "}
            <button onClick={() => remove(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}