import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Calendar, 
  Sparkles, Heart, Sun, Moon, Plus, X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { generateMockData } from './mockData';
import { MONTHS, YEARS, INCOME_CATEGORIES, EXPENSE_CATEGORIES, Transaction } from './types';

const PASTEL_COLORS = ['#34D399', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6', '#FB7185'];

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0].value,
    date: format(new Date(), 'yyyy-MM-dd'),
    note: ''
  });
  
  // Load initial data
  useEffect(() => {
    setTransactions(generateMockData());
  }, []);

  // Update body class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = parseISO(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      total: income - expense
    };
  }, [filteredTransactions]);

  const barData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTransactions = filteredTransactions.filter(t => t.date === dayStr);
      data.push({
        day: i,
        income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expense: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    return data;
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const expensePieData = useMemo(() => {
    const data: any[] = [];
    EXPENSE_CATEGORIES.forEach(cat => {
      const amount = filteredTransactions
        .filter(t => t.type === 'expense' && t.category === cat.value)
        .reduce((sum, t) => sum + t.amount, 0);
      if (amount > 0) {
        data.push({ name: cat.label, value: amount });
      }
    });
    return data;
  }, [filteredTransactions]);

  const incomePieData = useMemo(() => {
    const data: any[] = [];
    INCOME_CATEGORIES.forEach(cat => {
      const amount = filteredTransactions
        .filter(t => t.type === 'income' && t.category === cat.value)
        .reduce((sum, t) => sum + t.amount, 0);
      if (amount > 0) {
        data.push({ name: cat.label, value: amount });
      }
    });
    return data;
  }, [filteredTransactions]);

  const encouragement = useMemo(() => {
    const messages = [
      "เก่งมากเลย! ทำต่อไปนะ ✨",
      "วันนี้คุณทำได้ดีมาก 🌟",
      "ทุกบาทมีค่า ออมวันละนิดนะ 🐷",
      "ภูมิใจในตัวคุณจัง 💖",
      "วางแผนดี มีชัยไปกว่าครึ่ง 🧠",
      "สู้ๆ นะ เป็นกำลังใจให้ 🌈"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [selectedMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type,
      note: formData.note
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    setFormData({
      ...formData,
      amount: '',
      note: ''
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-soft'}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-20">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-brand font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <Plus className="w-5 h-5" />
            เพิ่มรายการ
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
              isDarkMode ? 'bg-indigo-600 text-yellow-300' : 'bg-white text-orange-400'
            }`}
          >
            {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>

        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className={`text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-brand flex items-center justify-center gap-3`}>
            แอปจัดการรายรับ-รายจ่าย 🐣💰
          </h1>
          <p className={`font-medium italic ${isDarkMode ? 'text-slate-400' : 'text-black opacity-70'}`}>{encouragement}</p>
        </header>

        {/* Selectors */}
        <div className={`flex flex-wrap justify-center gap-4 p-4 rounded-3xl shadow-sm border ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-brand-light-blue'
        }`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
            isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'
          }`}>
            <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-emerald-300' : 'text-black'
              }`}
            >
              {MONTHS.map((m, i) => <option key={m} value={i} className="text-black">{m}</option>)}
            </select>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
            isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'
          }`}>
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-blue-300' : 'text-black'
              }`}
            >
              {YEARS.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[2rem] shadow-sm border-b-4 border-emerald-400 hover:translate-y-[-4px] transition-all ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl">💛</span>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-black opacity-60'}`}>รายได้ทั้งหมด</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-black'}`}>฿{stats.income.toLocaleString()}</p>
          </div>

          <div className={`p-6 rounded-[2rem] shadow-sm border-b-4 border-blue-400 hover:translate-y-[-4px] transition-all ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-2xl">
                <TrendingDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl">🧾</span>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-black opacity-60'}`}>รายจ่ายทั้งหมด</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-black'}`}>฿{stats.expense.toLocaleString()}</p>
          </div>

          <div className={`p-6 rounded-[2rem] shadow-sm border-b-4 border-indigo-400 hover:translate-y-[-4px] transition-all ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-2xl">
                <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-2xl">🌟</span>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-black opacity-60'}`}>คงเหลือสุทธิ</p>
            <p className={`text-2xl font-black ${stats.total >= 0 ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-rose-500'}`}>
              ฿{stats.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className={`p-6 rounded-[2.5rem] shadow-sm border ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'
        }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-black'}`}>
            📊 สรุปรายวัน <span className={`text-sm font-normal ${isDarkMode ? 'text-slate-400' : 'text-black opacity-50'}`}>(รายรับ vs รายจ่าย)</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e5e7eb"} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#000000' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#000000' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '15px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#f8fafc' : '#000000'
                  }}
                  itemStyle={{ color: isDarkMode ? '#f8fafc' : '#000000' }}
                  cursor={{ fill: isDarkMode ? '#334155' : '#f9fafb' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar name="รายรับ 💰" dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar name="รายจ่าย 💸" dataKey="expense" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Income Breakdown */}
          <div className={`p-6 rounded-[2.5rem] shadow-sm border ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'
          }`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-black'}`}>
              🥧 สัดส่วนรายได้ <span className="text-lg">💼</span>
            </h3>
            <div className="h-[250px] w-full">
              {incomePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomePieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip 
                      contentStyle={{ 
                        borderRadius: '15px', 
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: 'none',
                        color: isDarkMode ? '#f8fafc' : '#000000'
                      }}
                      itemStyle={{ color: isDarkMode ? '#f8fafc' : '#000000' }}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className={`h-full flex items-center justify-center italic ${isDarkMode ? 'text-slate-400' : 'text-black opacity-40'}`}>ไม่มีข้อมูลรายได้ในเดือนนี้ 🐣</div>
              )}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className={`p-6 rounded-[2.5rem] shadow-sm border ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'
          }`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-black'}`}>
              🥧 สัดส่วนรายจ่าย <span className="text-lg">🛍️</span>
            </h3>
            <div className="h-[250px] w-full">
              {expensePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensePieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PASTEL_COLORS[(index + 3) % PASTEL_COLORS.length]} />
                      ))}
                    </Pie>
                    <PieTooltip 
                      contentStyle={{ 
                        borderRadius: '15px', 
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: 'none',
                        color: isDarkMode ? '#f8fafc' : '#000000'
                      }}
                      itemStyle={{ color: isDarkMode ? '#f8fafc' : '#000000' }}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className={`h-full flex items-center justify-center italic ${isDarkMode ? 'text-slate-400' : 'text-black opacity-40'}`}>ไม่มีข้อมูลรายจ่ายในเดือนนี้ 🐣</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <footer className="text-center py-8">
          <p className={`flex items-center justify-center gap-2 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-black'}`}>
            สร้างด้วย <Heart className="w-4 h-4 fill-current text-rose-400" /> เพื่อสุขภาพทางการเงินที่ดีของคุณ!
          </p>
        </footer>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl transform transition-all animate-in zoom-in duration-300 ${
            isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-black ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-brand' : 'text-black'}`}>
                เพิ่มรายการใหม่ 📝
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: 'expense', category: EXPENSE_CATEGORIES[0].value });
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                    formData.type === 'expense' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-500' : 'text-slate-400'
                  }`}
                >
                  รายจ่าย 💸
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, type: 'income', category: INCOME_CATEGORIES[0].value });
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                    formData.type === 'income' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  รายรับ 💰
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className={`block text-sm font-bold mb-1 ml-2 ${isDarkMode ? 'opacity-70' : 'text-black'}`}>จำนวนเงิน (฿)</label>
                <input
                  autoFocus
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-colors ${
                    isDarkMode ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-black'
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-bold mb-1 ml-2 ${isDarkMode ? 'opacity-70' : 'text-black'}`}>หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-colors ${
                    isDarkMode ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-black'
                  }`}
                >
                  {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                    <option key={cat.value} value={cat.value} className="text-black">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-bold mb-1 ml-2 ${isDarkMode ? 'opacity-70' : 'text-black'}`}>วันที่</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-colors ${
                    isDarkMode ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-black'
                  }`}
                />
              </div>

              {/* Note */}
              <div>
                <label className={`block text-sm font-bold mb-1 ml-2 ${isDarkMode ? 'opacity-70' : 'text-black'}`}>บันทึกเพิ่มเติม (ไม่บังคับ)</label>
                <input
                  type="text"
                  placeholder="บันทึกช่วยจำ..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className={`w-full px-5 py-3 rounded-2xl border-2 focus:outline-none transition-colors ${
                    isDarkMode ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-black'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 mt-4 bg-gradient-brand font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}
              >
                บันทึกรายการ ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
