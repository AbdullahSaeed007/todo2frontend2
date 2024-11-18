
import Signin from '../../../components/authComponent/signin'

export default function PageSignIn({currentUser, setCurrentUser}) {
  return (
          <Signin
         
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
           
          />

  );
}
