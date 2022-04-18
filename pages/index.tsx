import styles from '../styles/Home.module.css'
import 'firebase/auth'
// import firebaseui from 'firebaseui'
import { doc, getFirestore } from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  AuthProvider,
  useSigninCheck,
} from 'reactfire'
import { Button } from '@chakra-ui/react'

const BurritoTaste = () => {
  const burritoRef = doc(useFirestore(), 'tryreactfire', 'burrito')

  const { status, data } = useFirestoreDocData(burritoRef)

  if (status === 'loading') {
    return <p>fetching burrito...</p>
  }

  return <p>the burrito is {data.yummy ? 'good' : 'bad'}</p>
}

function Logout() {
  const app = useFirebaseApp()

  const auth = getAuth(app)

  return (
    <Button
      onClick={async () => {
        await signOut(auth)
      }}
    >
      Logout
    </Button>
  )
}

function Login() {
  const app = useFirebaseApp()

  const auth = getAuth(app)

  const provider = new GoogleAuthProvider()

  async function signIn() {
    try {
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      console.log(token, user)
    } catch (err) {
      console.log(err)
    }
  }

  return <Button onClick={signIn}>Sign In</Button>
}

function SignInAndOutButton() {
  const { status: authStatus, data: authData } = useSigninCheck()

  return <>{authData.signedIn ? <Logout /> : <Login />}</>
}

function Home() {
  const app = useFirebaseApp()

  const firestore = getFirestore(app)

  const auth = getAuth(app)

  return (
    <FirestoreProvider sdk={firestore}>
      <AuthProvider sdk={auth}>
        <SignInAndOutButton />
        <BurritoTaste />
      </AuthProvider>
    </FirestoreProvider>
  )
}

export default Home
