import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Contact from './pages/Contact.tsx'
import About from './pages/About.tsx'
import Services from './pages/Services.tsx'
import Blog from './pages/Blog.tsx'
import BlogPost from './pages/BlogPost.tsx'
import DashboardLayout from './components/DashboardLayout.tsx'
import SuccessPage from './components/SuccessPage.tsx'
import { I18nProvider } from './i18n.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  { path: '/about', element: <About /> },
  { path: '/services', element: <Services /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:postId', element: <BlogPost /> },
  { path: '/dashboard', element: <DashboardLayout /> },
  { path: '/leads', element: <DashboardLayout /> },
  { path: '/deleted', element: <DashboardLayout /> },
  { path: '/logs', element: <DashboardLayout /> },
  { path: '/success', element: <SuccessPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router}/>
    </I18nProvider>
  </StrictMode>,
)
