import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
  AuthProvider,
} from 'reactfire'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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

function OtherFirebaseProviders({ children }: { children: React.ReactChild }) {
  const app = useFirebaseApp()

  const firestore = getFirestore(app)

  const auth = getAuth(app)

  return (
    <FirestoreProvider sdk={firestore}>
      <AuthProvider sdk={auth}>{children}</AuthProvider>
    </FirestoreProvider>
  )
}

const AppProviders = ({ children }: { children: React.ReactChild }) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <OtherFirebaseProviders>
        <ChakraProvider resetCSS theme={theme}>
          {children}
        </ChakraProvider>
      </OtherFirebaseProviders>
    </FirebaseAppProvider>
  )
}

export { AppProviders }
