import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Login from './pages/login';
import Register from './pages/register';
import UserType from './pages/user-type';
import FreelancerDashboard from './pages/freelancer/dashboard';
import FreelancerDetails from './pages/freelancer/details';
import ClientDashboard from './pages/client/dashboard';
import AdminDashboard from './pages/admin/dashboard';
import ProjectList from './pages/projects/list';
import ProjectDetails from './pages/projects/details';
import CreateProject from './pages/projects/create';
import Profile from './pages/profile';
import Navigation from './components/Navigation';
import './App.css';

const theme = extendTheme({
  colors: {
    workora: {
      navy: '#0B1340',
      turquoise: '#40E0D0'
    }
  }
});

function App() {
  console.log('App component rendering...');
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<UserType />} />
          <Route path="/select-type" element={<UserType />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/freelancer/dashboard" element={
            <>
              <Navigation />
              <FreelancerDashboard />
            </>
          } />
          <Route path="/freelancer/details" element={
            <>
              <Navigation />
              <FreelancerDetails />
            </>
          } />
          <Route path="/client/dashboard" element={
            <>
              <Navigation />
              <ClientDashboard />
            </>
          } />
          <Route path="/admin/dashboard" element={
            <>
              <Navigation />
              <AdminDashboard />
            </>
          } />
          <Route path="/projects" element={
            <>
              <Navigation />
              <ProjectList />
            </>
          } />
          <Route path="/projects/:id" element={
            <>
              <Navigation />
              <ProjectDetails />
            </>
          } />
          <Route path="/projects/create" element={
            <>
              <Navigation />
              <CreateProject />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navigation />
              <Profile />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
