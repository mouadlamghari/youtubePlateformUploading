import { ErrorInterface } from "../Inrefaces/ErrorInterface";

interface ValidationErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  username?: string;
}

export const handleErrors = (err:ErrorInterface) :ValidationErrors | undefined  => {
    // duplicate error
    let errors : ValidationErrors ={};
    if (err.code === 11000) {
        const errKey = err.keyPattern as ValidationErrors;
        Object.keys(errKey).map((e)=>errors[e as keyof ValidationErrors ]=`the ${e} is already in use`)
        return errors
    }
    
    //validation errors
    if (err.message.includes("auth validation failed")) {
        let errors = { email: "", firstName: "", lastName: "", password: "",username:"" }
      // destructuring inside the forEach, similar to (err) => {err.properties}
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path as keyof ValidationErrors ] = properties.message
      })
      return errors
    }
  }

