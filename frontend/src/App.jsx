import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Inicio from './pages/Inicio.jsx'
import MeusDados from './pages/MeusDados.jsx'
import Clientes from './pages/Clientes.jsx'
import Automoveis from './pages/Automoveis.jsx'
import Pedidos from './pages/Pedidos.jsx'
import AnalisePedidos from './pages/AnalisePedidos.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida><Layout /></RotaProtegida>}>
        <Route path="/" element={<Inicio />} />
        <Route path="/meus-dados" element={<RotaProtegida perfis={['CLIENTE']}><MeusDados /></RotaProtegida>} />
        <Route path="/automoveis" element={<Automoveis />} />
        <Route path="/pedidos" element={<RotaProtegida perfis={['CLIENTE']}><Pedidos /></RotaProtegida>} />
        <Route path="/analise" element={<RotaProtegida perfis={['EMPRESA', 'BANCO']}><AnalisePedidos /></RotaProtegida>} />
        <Route path="/clientes" element={<RotaProtegida perfis={['EMPRESA', 'BANCO']}><Clientes /></RotaProtegida>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
