import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Loader2, IndianRupee, Store, PieChart, AlertTriangle, CheckCircle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expense, setExpense] = useState({ merchant: '', amount: 0, category: 'Food' });
  const [monthlyTotal, setMonthlyTotal] = useState(4500); // Mock existing data
  const BUDGET_LIMIT = 5000;

  const handleProcess = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => m.status === 'recognizing text' && setProgress(Math.round(m.progress * 100))
    });

    // Smart Math Logic
    const prices = text.replace(/\|/g, '1').match(/\d+\.\d{2}/g);
    if (prices) {
      const total = Math.max(...prices.map(p => parseFloat(p)));
      const lines = text.split('\n').filter(l => l.length > 3);
      setExpense({ ...expense, merchant: lines[0].toUpperCase().substring(0, 15), amount: total });
    }
    setLoading(false);
  };

  const isOverBudget = monthlyTotal + parseFloat(expense.amount) > BUDGET_LIMIT;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Wealthwise OCR</h2>
        <p style={styles.subtitle}>Smart Expense Manager</p>

        {/* Budget Status Bar */}
        <div style={styles.budgetBar}>
          <div style={{...styles.progress, width: `${(monthlyTotal/BUDGET_LIMIT)*100}%`, background: monthlyTotal > BUDGET_LIMIT * 0.8 ? '#ef4444' : '#10b981'}}></div>
        </div>
        <p style={styles.budgetText}>Budget Used: ₹{monthlyTotal} / ₹{BUDGET_LIMIT}</p>

        <div style={styles.uploadArea}>
          <input type="file" id="upload" onChange={handleProcess} hidden />
          <label htmlFor="upload" style={styles.label}>
            {loading ? <Loader2 className="animate-spin" /> : <Upload />}
            <span>{loading ? `Scanning... ${progress}%` : "Scan New Receipt"}</span>
          </label>
        </div>

        {expense.amount > 0 && !loading && (
          <div style={styles.form}>
            <div style={styles.inputGroup}><Store size={16}/> <input value={expense.merchant} readOnly style={styles.readOnly}/></div>
            <div style={styles.inputGroup}><IndianRupee size={16}/> <input type="number" value={expense.amount} onChange={(e)=>setExpense({...expense, amount: e.target.value})} style={styles.input}/></div>
            
            <select style={styles.select} value={expense.category} onChange={(e)=>setExpense({...expense, category: e.target.value})}>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
            </select>

            {isOverBudget && (
              <div style={styles.warning}>
                <AlertTriangle size={16} /> Warning: This exceeds your budget!
              </div>
            )}

            <button style={styles.saveBtn} onClick={() => {alert("Transaction Logged!"); setMonthlyTotal(monthlyTotal + parseFloat(expense.amount))}}>
              <CheckCircle size={18} /> Confirm & Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, sans-serif' },
  card: { background: '#fff', width: '360px', padding: '25px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  title: { margin: 0, color: '#1e293b', fontSize: '22px' },
  subtitle: { margin: '0 0 20px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
  budgetBar: { height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' },
  progress: { height: '100%', transition: '0.5s ease' },
  budgetText: { fontSize: '11px', color: '#64748b', marginTop: '5px', textAlign: 'right' },
  uploadArea: { marginTop: '20px', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '30px', textAlign: 'center' },
  label: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: '500' },
  form: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  inputGroup: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' },
  readOnly: { border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', width: '100%' },
  input: { border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', fontSize: '16px', width: '100%' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' },
  warning: { color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', background: '#fee2e2', padding: '8px', borderRadius: '6px' },
  saveBtn: { background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default App;

