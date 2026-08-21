import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BeatGenerator from "./pages/BeatGenerator";
import Dashboard from "./pages/Dashboard";
import Ledger from "./pages/Ledger";

export default function App() {
  return <Routes><Route element={<Layout/>}><Route index element={<Navigate to="/beat" replace/>}/><Route path="/beat" element={<BeatGenerator/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/ledger" element={<Ledger/>}/></Route></Routes>;
}
