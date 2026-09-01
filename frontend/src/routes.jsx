import { createBrowserRouter, Navigate } from 'react-router-dom'

import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SubmitComplaintPage from './pages/SubmitComplaintPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import DepartmentPage from './pages/DepartmentPage'
import HowItWorksPage from './pages/HowItWorksPage'


const router = createBrowserRouter([

  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'submit',
        element: <SubmitComplaintPage />,
      },
      {
        path: 'track',
        element: <TrackComplaintPage />,
      },
      {
        path: 'department',
        element: <DepartmentPage />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />,
      },
    ],
  },

  {
    path: '/app',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'submit',
        element: <SubmitComplaintPage />,
      },
      {
        path: 'track',
        element: <TrackComplaintPage />,
      },
      {
        path: 'department',
        element: <DepartmentPage />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  }

])


export default router