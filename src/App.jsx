import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HeaderPublic from './components/HeaderPublic';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Produto from './pages/Produto';
import ProdutoForm from './pages/ProdutoForm';
import Perfil from './pages/Perfil';
import Pedidos from './pages/Pedidos';
import PedidoDetalhe from './pages/PedidoDetalhe';
import Categorias from './pages/admin/Categorias';
import Tags from './pages/admin/Tags';

const PUBLIC_ROUTES = ['/login', '/register'];

function AppShell() {
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  return (
    <>
      {isPublic ? <HeaderPublic /> : <Navbar />}
      <main className={isPublic ? '' : 'container'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/produtos/novo" element={<ProtectedRoute><ProdutoForm /></ProtectedRoute>} />
          <Route path="/produtos/:id" element={<ProtectedRoute><Produto /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
          <Route path="/pedidos/:id" element={<ProtectedRoute><PedidoDetalhe /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
          <Route path="/admin/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
