import React, { useState, useEffect } from 'react';
import { 
  Calculator, Users, DollarSign, Wallet, ArrowRightLeft, 
  UserCheck, Shield, Plus, Trash2, CheckCircle, TrendingUp, BookOpen, Sparkles, ArrowUpRight, User 
} from 'lucide-react';

export default function App() {
  const [tasaDolar, setTasaDolar] = useState(() => parseFloat(localStorage.getItem('tasaDolar')) || 36.5);
  const [usuarioActual, setUsuarioActual] = useState('Admin');
  
  const [empleados, setEmpleados] = useState(() => {
    const saved = localStorage.getItem('empleados');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'Ana', deudaInicial: 50, abonosTotales: 10 },
      { id: 2, nombre: 'Maria', deudaInicial: 30, abonosTotales: 5 }
    ];
  });

  const [ventas, setVentas] = useState(() => {
    const saved = localStorage.getItem('ventas');
    return saved ? JSON.parse(saved) : [];
  });

  const [nuevoMontoVES, setNuevoMontoVES] = useState('');
  const [nuevoNickVenta, setNuevoNickVenta] = useState('Admin');
  const [nuevoNombreEmpleado, setNuevoNombreEmpleado] = useState('');
  const [nuevaDeudaInicial, setNuevaDeudaInicial] = useState('');
  const [montoAbono, setMontoAbono] = useState({});

  useEffect(() => {
    localStorage.setItem('tasaDolar', tasaDolar);
    localStorage.setItem('empleados', JSON.stringify(empleados));
    localStorage.setItem('ventas', JSON.stringify(ventas));
  }, [tasaDolar, empleados, ventas]);

  const registrarVenta = (e) => {
    e.preventDefault();
    if (!nuevoMontoVES || isNaN(nuevoMontoVES) || Number(nuevoMontoVES) <= 0) return;

    const nuevaVenta = {
      id: Date.now(),
      nick: nuevoNickVenta,
      montoVES: parseFloat(nuevoMontoVES),
      fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setVentas([nuevaVenta, ...ventas]);
    setNuevoMontoVES('');
  };

  const agregarEmpleado = (e) => {
    e.preventDefault();
    if (!nuevoNombreEmpleado.trim()) return;

    const nuevoEmp = {
      id: Date.now(),
      nombre: nuevoNombreEmpleado.trim(),
      deudaInicial: parseFloat(nuevaDeudaInicial) || 0,
      abonosTotales: 0
    };

    setEmpleados([...empleados, nuevoEmp]);
    setNuevoNombreEmpleado('');
    setNuevaDeudaInicial('');
  };

  const eliminarVenta = (id) => {
    setVentas(ventas.filter(v => v.id !== id));
  };

  const registrarAbono = (nombreEmpleado, monto) => {
    const val = parseFloat(monto);
    if (isNaN(val) || val <= 0) return;

    setEmpleados(empleados.map(emp => {
      if (emp.nombre === nombreEmpleado) {
        return { ...emp, abonosTotales: emp.abonosTotales + val };
      }
      return emp;
    }));
    setMontoAbono({ ...montoAbono, [nombreEmpleado]: '' });
  };

  const ventasAdminVES = ventas.filter(v => v.nick === 'Admin').reduce((acc, v) => acc + v.montoVES, 0);
  const ventasAdminUSDT = tasaDolar > 0 ? ventasAdminVES / tasaDolar : 0;

  const resumenEmpleados = empleados.map(emp => {
    const ventasEmpVES = ventas.filter(v => v.nick === emp.nombre).reduce((acc, v) => acc + v.montoVES, 0);
    const ventasEmpUSDT = tasaDolar > 0 ? ventasEmpVES / tasaDolar : 0;
    
    const gananciaEmpleado80 = ventasEmpUSDT * 0.80;
    const comisionAdmin20 = ventasEmpUSDT * 0.20;
    const deudaPendiente = (emp.deudaInicial - emp.abonosTotales);

    return {
      nombre: emp.nombre,
      ventasVES: ventasEmpVES,
      ventasUSDT: ventasEmpUSDT,
      gananciaEmpleado80,
      comisionAdmin20,
      deudaInicial: emp.deudaInicial,
      abonosTotales: emp.abonosTotales,
      deudaPendiente: deudaPendiente > 0 ? deudaPendiente : 0
    };
  });

  const totalVentasVES = ventas.reduce((acc, v) => acc + v.montoVES, 0);
  const totalVentasUSDT = tasaDolar > 0 ? totalVentasVES / tasaDolar : 0;
  const totalComisionAdmin20 = resumenEmpleados.reduce((acc, e) => acc + e.comisionAdmin20, 0);
  const granTotalAdminUSDT = ventasAdminUSDT + totalComisionAdmin20;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4 sm:p-6 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-xl mx-auto space-y-5 pb-12">
        
        {/* HEADER TIPO APP FINANCIERA */}
        <header className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
                <Sparkles className="w-6 h-6 font-black" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Dr Finanzas <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">PRO</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Control de Negocio & USDT</p>
              </div>
            </div>

            {/* TASA DE CAMBIO */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-inner">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Tasa $1</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    step="0.01"
                    value={tasaDolar} 
                    onChange={(e) => setTasaDolar(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-transparent text-emerald-400 font-bold text-xs focus:outline-none text-right"
                  />
                  <span className="text-[10px] text-slate-400">Bs</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SELECTOR DE PERFIL TIPO SWITCH */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto shadow-md">
          <button 
            onClick={() => setUsuarioActual('Admin')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${usuarioActual === 'Admin' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" /> Dueño (Admin)
          </button>
          {empleados.map(emp => (
            <button 
              key={emp.id}
              onClick={() => setUsuarioActual(emp.nombre)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${usuarioActual === emp.nombre ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-3.5 h-3.5" /> {emp.nombre}
            </button>
          ))}
        </div>

        {/* TARJETAS DE BALANCE PRINCIPAL */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl"></div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ventas Totales</span>
            <span className="text-2xl font-black text-white mt-1 block tracking-tight">${totalVentasUSDT.toFixed(2)}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{totalVentasVES.toLocaleString()} VES</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Tu Ingreso (Admin)</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block tracking-tight">${granTotalAdminUSDT.toFixed(2)}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Ventas + 20% comisiones</span>
          </div>
        </div>

        {/* REGISTRAR VENTA */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-3.5">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            Registrar Venta en Bolívares
          </h2>
          <form onSubmit={registrarVenta} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">¿Quién vendió?</label>
                <select 
                  value={nuevoNickVenta} 
                  onChange={(e) => setNuevoNickVenta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Admin">Admin (Tú)</option>
                  {empleados.map(emp => (
                    <option key={emp.id} value={emp.nombre}>{emp.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Monto (VES)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Ej. 3650"
                  value={nuevoMontoVES}
                  onChange={(e) => setNuevoMontoVES(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" /> Guardar Venta
            </button>
          </form>
        </div>

        {/* CONTENIDO SEGÚN ROL */}
        {usuarioActual === 'Admin' ? (
          <div className="space-y-4">
            
            {/* TARJETAS DE EMPLEADAS */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Users className="w-4 h-4" />
                </div>
                Rendimiento y Comisiones por Empleada
              </h2>

              <div className="space-y-3">
                {resumenEmpleados.map((emp, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-inner space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-xs text-slate-950">
                          {emp.nombre.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{emp.nombre}</span>
                          <span className="text-[10px] text-slate-400">{emp.ventasVES.toLocaleString()} VES</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-300 block">${emp.ventasUSDT.toFixed(2)} USDT</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                        <span className="text-[10px] text-emerald-400 font-bold block">Su Ganancia (80%)</span>
                        <span className="text-sm font-black text-emerald-400">${emp.gananciaEmpleado80.toFixed(2)}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
                        <span className="text-[10px] text-cyan-400 font-bold block">Tu Comisión (20%)</span>
                        <span className="text-sm font-black text-cyan-400">${emp.comisionAdmin20.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {resumenEmpleados.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-4">No hay empleadas agregadas.</p>
                )}
              </div>
            </div>

            {/* CONTROL DE DEUDAS */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                Control de Deudas y Abonos
              </h2>

              <form onSubmit={agregarEmpleado} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nombre Empleada"
                    value={nuevoNombreEmpleado}
                    onChange={(e) => setNuevoNombreEmpleado(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Deuda Inicial ($)"
                    value={nuevaDeudaInicial}
                    onChange={(e) => setNuevaDeudaInicial(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-amber-950 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Registrar Empleada con Deuda
                </button>
              </form>

              <div className="space-y-3">
                {resumenEmpleados.map((emp, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{emp.nombre}</span>
                      <span className="text-[11px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold">
                        Deuda: ${emp.deudaPendiente.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Inicial: ${emp.deudaInicial.toFixed(2)}</span>
                      <span>Abonado: ${emp.abonosTotales.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Monto abono ($)"
                        value={montoAbono[emp.nombre] || ''}
                        onChange={(e) => setMontoAbono({ ...montoAbono, [emp.nombre]: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                      />
                      <button 
                        onClick={() => registrarAbono(emp.nombre, montoAbono[emp.nombre])}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow whitespace-nowrap"
                      >
                        Abonar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* VISTA DE EMPLEADA */
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Panel Personal</span>
                <h2 className="text-lg font-black text-white">{usuarioActual}</h2>
              </div>
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            {(() => {
              const info = resumenEmpleados.find(e => e.nombre === usuarioActual) || { ventasVES: 0, ventasUSDT: 0, gananciaEmpleado80: 0, deudaPendiente: 0, deudaInicial: 0, abonosTotales: 0 };
              return (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Tus Ventas Totales</span>
                      <span className="text-xl font-black text-white">${info.ventasUSDT.toFixed(2)}</span>
                    </div>
                    <span className="text-xs text-slate-500">{info.ventasVES.toLocaleString()} VES</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-semibold block">Tu Ganancia Neta (80%)</span>
                      <span className="text-xl font-black text-emerald-400">${info.gananciaEmpleado80.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-
