import styles from '../styles/Home.module.css'
import 'firebase/auth'
// import firebaseui from 'firebaseui'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useFirebaseApp, useSigninCheck } from 'reactfire'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'

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

  return <>{authData?.signedIn ? <Logout /> : <Login />}</>
}

function AuthenticatedApp() {
  return (
    <Flex direction="column">
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input placeholder="name" type="text" id="name" />
      </FormControl>
    </Flex>
  )
}

function LandingScreen() {
  return (
    <Flex direction="column" align="center">
      <Heading as="h1">Wecome to Picker for Students!</Heading>
    </Flex>
  )
}

function Home() {
  const { data } = useSigninCheck()

  return (
    <>
      <SignInAndOutButton />
      {data?.signedIn === true ? <AuthenticatedApp /> : <LandingScreen />}
    </>
  )
}

export default Home
