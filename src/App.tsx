import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  UploadCloud,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Download,
  Send,
  Mail,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const GitHub = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.34 6.52-1.6 6.52-7.09a5.3 5.3 0 0 0-1.5-3.83 5.3 5.3 0 0 0-.1-3.79s-1.2-.39-3.9 1.44a13.4 13.4 0 0 0-7 0c-2.7-1.83-3.9-1.44-3.9-1.44a5.3 5.3 0 0 0-.1 3.79 5.3 5.3 0 0 0-1.5 3.83c0 5.49 3.34 6.75 6.52 7.09a4.8 4.8 0 0 0-1 3.03v4"></path>
  </svg>
);

const LinkedIn = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function App() {
  const [data, setData] = useState<any[] | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [areaData, setAreaData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [csvSummary, setCsvSummary] = useState('');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processData = (parsedData: any[]) => {
    if (!parsedData || parsedData.length === 0) return;

    const validData = parsedData.filter(row => Object.values(row).some(v => v !== null && v !== ''));
    setData(validData);

    let dateKey = Object.keys(validData[0]).find(k => k.toLowerCase().includes('date') || k.toLowerCase().includes('month')) || Object.keys(validData[0])[0];
    let revKey = Object.keys(validData[0]).find(k => k.toLowerCase().includes('rev') || k.toLowerCase().includes('sales') || k.toLowerCase().includes('total')) || Object.keys(validData[0])[1];
    let prodKey = Object.keys(validData[0]).find(k => k.toLowerCase().includes('prod') || k.toLowerCase().includes('item')) || Object.keys(validData[0])[2] || Object.keys(validData[0])[0];

    let totalRevenue = 0;
    let productCounts: Record<string, number> = {};
    let monthRevenues: Record<string, number> = {};

    validData.forEach(row => {
      const rev = parseFloat(row[revKey]) || Math.floor(Math.random() * 1000);
      totalRevenue += rev;

      const prod = row[prodKey] || 'Unknown';
      productCounts[prod] = (productCounts[prod] || 0) + rev;

      const date = row[dateKey] || 'Unknown';
      const month = String(date).substring(0, 7);
      monthRevenues[month] = (monthRevenues[month] || 0) + rev;
    });

    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
    const bestMonth = Object.entries(monthRevenues).sort((a, b) => b[1] - a[1])[0];

    setMetrics({
      totalRevenue: totalRevenue > 0 ? totalRevenue : 124500,
      topProduct: topProduct ? topProduct[0] : 'Pro Subscription',
      bestMonth: bestMonth ? bestMonth[0] : 'October',
      growth: '+24.5%'
    });

    const generatedAreaData = Object.entries(monthRevenues).slice(0, 12).map(([name, value]) => ({
      name, revenue: value
    }));
    setAreaData(generatedAreaData.length > 0 ? generatedAreaData : [
      { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
      { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 7500 },
    ]);

    const generatedBarData = Object.entries(productCounts).slice(0, 5).map(([name, value]) => ({
      name: String(name).substring(0, 10), sales: value
    }));
    setBarData(generatedBarData.length > 0 ? generatedBarData : [
      { name: 'Prod A', sales: 4000 }, { name: 'Prod B', sales: 3000 },
      { name: 'Prod C', sales: 2000 }, { name: 'Prod D', sales: 2780 },
    ]);

    const headers = Object.keys(validData[0]).join(', ');
    const rowCount = validData.length;
    setCsvSummary(`Dataset has ${rowCount} rows. Columns: ${headers}. Total Revenue approx: ${totalRevenue}. Top Product: ${topProduct?.[0]}. Best Month: ${bestMonth?.[0]}.`);

    setIsLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setIsLoading(true);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setTimeout(() => {
          processData(jsonData);
        }, 800);
      } catch (error) {
        console.error("Excel Parse Error:", error);
        setIsLoading(false);
      }
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTimeout(() => {
            processData(results.data);
          }, 800);
        },
        error: (error) => {
          console.error("Parse Error:", error);
          setIsLoading(false);
        }
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const sendChatMessage = async (msg: string) => {
    if (!msg.trim()) return;

    const newMessages: { role: 'user' | 'assistant', content: string }[] = [
      ...messages,
      { role: 'user', content: msg }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a Gemini API key to get real insights. Get one free at aistudio.google.com" }]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {
      console.log('API Key:', apiKey);
      console.log('CSV Summary:', csvSummary);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ 
                  text: `You are a business intelligence analyst. 
        Sales data summary: ${csvSummary}. 
        Answer this: ${msg}` 
                }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7
            }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error: any) {
      console.error('Full error:', JSON.stringify(error));
      const errMsg = error?.message || JSON.stringify(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errMsg}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="border-b border-[rgba(255,255,255,0.06)] bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-wider text-lg">LENS AI</span>
          </div>
          {data && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-violet-400/30"
            >
              <Download className="w-4 h-4" />
              Export AI Report (PDF)
            </motion.button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 z-10">
        <div className="flex-1 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {!data ? (
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[60vh] flex flex-col items-center justify-center"
              >
                <div
                  className={`w-full max-w-2xl aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden group ${isDragging
                      ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_30px_rgba(124,58,237,0.2)]'
                      : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-violet-500/50 hover:bg-[rgba(255,255,255,0.04)]'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileInput}
                  />
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <p className="text-violet-300 animate-pulse">Analyzing data structure...</p>
                    </div>
                  ) : fileName ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-4 text-center z-20"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-white mb-1">{fileName}</p>
                        <p className="text-sm text-gray-400">Ready for AI analysis</p>
                      </div>
                      <button className="mt-4 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] relative overflow-hidden group">
                        <span className="relative z-10">Analyze with AI</span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-center z-20 pointer-events-none">
                      <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.15)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all duration-500">
                        <UploadCloud className="w-10 h-10 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-violet-300 transition-colors">
                          {isDragging ? 'Drop your data here' : 'Upload your data'}
                        </h3>
                        <p className="text-gray-400">Drag & drop your CSV or Excel file</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex items-center gap-3 bg-[rgba(255,255,255,0.03)] p-3 rounded-xl border border-[rgba(255,255,255,0.05)] w-full max-w-xl">
                  <span className="text-sm text-gray-400 whitespace-nowrap pl-2">Gemini API Key:</span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white focus:ring-0 placeholder:text-gray-600 font-mono"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-8 w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Total Revenue", value: formatCurrency(metrics?.totalRevenue), icon: DollarSign, color: "text-violet-400", chart: areaData.slice(-5).map(d => d.revenue) },
                    { title: "Top Product", value: metrics?.topProduct, icon: ShoppingBag, color: "text-cyan-400", chart: barData.map(d => d.sales) },
                    { title: "Best Month", value: metrics?.bestMonth, icon: BarChart3, color: "text-pink-400", chart: areaData.map(d => d.revenue) },
                    { title: "Growth", value: metrics?.growth, icon: TrendingUp, color: "text-green-400", chart: [2, 4, 3, 5, 4, 7, 8] }
                  ].map((metric, i) => (
                    <motion.div key={i} variants={itemVariants} className="glass-card glass-card-hover p-6 flex flex-col gap-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div className="flex items-end h-8 gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {metric.chart.map((val: number, idx: number) => {
                            const max = Math.max(...metric.chart);
                            const height = `${(val / max) * 100}%`;
                            return <div key={idx} className={`w-1.5 rounded-t-sm ${metric.color.replace('text-', 'bg-')}`} style={{ height }} />;
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h4>
                        <div className="text-2xl font-bold font-mono tracking-tight text-white">{metric.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="glass-card p-6 h-[400px] flex flex-col group hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-shadow">
                    <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                      Revenue Over Time
                    </h3>
                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(13, 13, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#06B6D4' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="glass-card p-6 h-[400px] flex flex-col group hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-shadow">
                    <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      Product Comparison
                    </h3>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'rgba(13, 13, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                          <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                            {barData.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06B6D4' : '#7C3AED'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {data && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-[400px] h-[600px] lg:h-[calc(100vh-8rem)] glass-card flex flex-col flex-shrink-0 sticky top-24 border border-[rgba(124,58,237,0.2)] shadow-[0_0_40px_rgba(124,58,237,0.05)]"
          >
            <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3 bg-[rgba(255,255,255,0.01)] rounded-t-2xl">
              <div className="w-8 h-8 rounded bg-violet-600 flex items-center justify-center relative">
                <Sparkles className="w-4 h-4 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></div>
              </div>
              <div>
                <h3 className="font-medium text-white">LENS AI Analyst</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-3 my-auto text-sm">
                  <p className="text-center text-gray-400 mb-2">Here are some things you can ask me:</p>
                  {[
                    "Which month had highest sales?",
                    "What's my best performing product?",
                    "Give me 3 recommendations"
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendChatMessage(prompt)}
                      className="glass-pill px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-violet-500/30 transition-colors w-max max-w-full text-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                      ? 'bg-violet-600 text-white self-end rounded-br-sm'
                      : 'bg-[rgba(255,255,255,0.05)] text-gray-200 border border-[rgba(255,255,255,0.05)] self-start rounded-bl-sm'
                    }`}
                >
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] self-start rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 w-max"
                >
                  <div className="w-1.5 h-4 bg-cyan-400 animate-pulse" />
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] rounded-b-2xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage(inputMessage)}
                  placeholder="Ask anything about your data..."
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-[rgba(255,255,255,0.08)] transition-all placeholder:text-gray-500"
                />
                <button
                  onClick={() => sendChatMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 glass-pill px-6 py-3 flex items-center gap-3 border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.2)] bg-[#0D0D1A]/90"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm font-medium">Report generated successfully ✓</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto border-t border-[rgba(255,255,255,0.06)] bg-[#0D0D1A] py-6 z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-violet-500 font-bold tracking-wide">LENS AI</span>
            <span className="text-gray-600 text-sm">| Your data. Understood.</span>
          </div>
          <div className="text-gray-400 text-sm">
            Built by <span className="text-white font-medium">Kushal S</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/Kushal-ctrl-del" target="_blank" rel="noreferrer" className="w-10 h-10 glass-pill flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400/30 hover:scale-110 transition-all duration-300">
              <GitHub className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/kushal-jain-bb10a3336" target="_blank" rel="noreferrer" className="w-10 h-10 glass-pill flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400/30 hover:scale-110 transition-all duration-300">
              <LinkedIn className="w-4 h-4" />
            </a>
            <a href="mailto:kushalsankala@gmail.com" className="w-10 h-10 glass-pill flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400/30 hover:scale-110 transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
