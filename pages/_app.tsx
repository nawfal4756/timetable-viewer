import type { AppProps } from 'next/app'
import { useMemo } from 'react'
// import Crontab from 'reactjs-crontab'

export default function App({ Component, pageProps }: AppProps) {
  // const sendNotification = () => {
    
  // }
  // const tasks = useMemo(() => [
  //   {
  //     fn: sendNotification,
  //     config: '* 1 * * *'
  //   }
  // ], [])
  return (
    <Component {...pageProps}> 
      {/* <Crontab /> */}
    </Component>
  )
}
