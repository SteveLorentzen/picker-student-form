import 'firebase/auth'
// import firebaseui from 'firebaseui'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  useFirebaseApp,
  useFirestore,
  useSigninCheck,
  useUser,
} from 'reactfire'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import { doc, setDoc } from 'firebase/firestore'
import GoogleButton from 'react-google-button'
import { ReactChild } from 'react'

export const studentFactInputs = [
  'Favorite Movie',
  'Favorite Food',
  'Favorite TV Show',
  'Best Vacation',
  'Cutest Pet',
  'Signature Catch Phrase',
  'Favorite Ice Cream',
  'Favorite Book',
  'Favorite Character',
]

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

  const firestore = useFirestore()

  async function signIn() {
    try {
      const result = await signInWithPopup(auth, provider)
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      // const token = credential?.accessToken
      const user = result.user

      await setDoc(doc(firestore, 'students', user.uid), {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      })

      // console.log(token, user)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <GoogleButton type="light" onClick={signIn}>
      Sign In
    </GoogleButton>
  )
}

function SignInAndOutButton() {
  const { status: authStatus, data: authData } = useSigninCheck()

  return <>{authData?.signedIn ? <Logout /> : <Login />}</>
}

function StyledFormControl({
  children,
  ...props
}: {
  children: ReactChild | ReactChild[]
}) {
  return (
    <FormControl marginBottom="2rem" w="100%" {...props}>
      {children}
    </FormControl>
  )
}

function AuthenticatedApp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { data: userData } = useUser()

  let userId = ''
  if (typeof userData?.uid === 'string') {
    userId = userData.uid
  }

  const studentRef = doc(useFirestore(), 'students', userId)

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setDoc(
      studentRef,
      {
        profile: {
          name: data.name,
          'Favorite Movie': data['Favorite Movie'] || '',
          'Favorite Food': data['Favorite Food'] || '',
          'Favorite TV Show': data['Favorite TV Show'] || '',
          'Best Vacation': data['Best Vacation'] || '',
          'Cutest Pet': data['Cutest Pet'] || '',
          'Signature Catch Phrase': data['Signature Catch Phrase'] || '',
          'Favorite Ice Cream': data['Favorite Ice Cream'] || '',
          'Favorite Book': data['Favorite Book'] || '',
          'Favorite Character': data['Favorite Character'] || '',
        },
      },
      { merge: true },
    )
  }

  return (
    <Flex
      direction="column"
      maxW="80rem"
      w="100%"
      align="center"
      marginX="auto"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledFormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            {...register('name', {
              required: true,
              minLength: {
                value: 4,
                message: 'Please enter a name with at least 4 characters',
              },
            })}
            placeholder="name"
            type="text"
            id="name"
            autoComplete="off"
          />
        </StyledFormControl>

        {errors.name?.type === 'required' && <p>Name is required</p>}
        {errors.name?.type === 'minLength' && <p>{errors.name?.message}</p>}

        <StyledFormControl>
          <FormLabel htmlFor="profile-picture">Profile Picture</FormLabel>
          <Input
            {...register('profile-picture', { required: true })}
            placeholder="profile-picture"
            type="file"
            id="profile-picture"
            autoComplete="off"
          />
        </StyledFormControl>
        {studentFactInputs.map(studentFactInput => {
          return (
            <StyledFormControl key={studentFactInput}>
              <FormLabel htmlFor={studentFactInput}>
                {studentFactInput}
              </FormLabel>
              <Input
                {...register(studentFactInput)}
                placeholder={studentFactInput}
                type="text"
                id={studentFactInput}
                autoComplete="off"
              />
            </StyledFormControl>
          )
        })}
        <Button type="submit">Submit</Button>
      </form>
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
