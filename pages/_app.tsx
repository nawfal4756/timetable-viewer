import { Alert, AlertColor, Collapse } from '@mui/material'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
// import Crontab from 'reactjs-crontab'

export default function App({ Component, pageProps }: AppProps) {
  const [openAlert, setOpenAlert] = useState(false)
  const [alertObject, setAlertObject] = useState({severity: 'info', message: ''})
  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setAlertObject({severity: 'success', message: 'You are now online!'})
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
        }, 5000)
      } else {
        setAlertObject({severity: 'warning', message: 'You are now offline! Data provided might be old'})
        setOpenAlert(true)
        setTimeout(() => {
          setOpenAlert(false)
        }, 5000)
      }
    }
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  return (
    <>
      <Collapse in={openAlert}>
        <Alert severity={alertObject.severity as AlertColor | undefined} onClose={() => {setOpenAlert(false)}}>{alertObject.message}</Alert>
      </Collapse>
      <Component {...pageProps} />
    </>
  )
}
