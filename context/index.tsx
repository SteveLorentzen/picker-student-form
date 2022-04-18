import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { FirebaseAppProvider } from 'reactfire'
import theme from 'theme'

const firebaseConfig = {
  apiKey: 'AIzaSyAnxiAndOT2JgrBFheVuvZGqa7yXSBhC6c',
  authDomain: 'picker-8c90f.firebaseapp.com',
  projectId: 'picker-8c90f',
  storageBucket: 'picker-8c90f.appspot.com',
  messagingSenderId: '794267331427',
  appId: '1:794267331427:web:67a7fa473f6040649e0156',
  measurementId: 'G-79LPC7HWSJ',
}

const AppProviders = ({ children }: { children: React.ReactChild }) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ChakraProvider resetCSS theme={theme}>
        {children}
      </ChakraProvider>
    </FirebaseAppProvider>
  )
}

export { AppProviders }
