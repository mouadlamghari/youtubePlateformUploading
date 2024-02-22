export const handleErrors = (err) => {
    // duplicate error
    if (err.code === 11000) {
        let errors={};
        Object.keys(err.keyPattern).map(e=>errors[e]=`the ${e} is already in use`)
        return errors
    }
    
    //validation errors
    if (err.message.includes("auth validation failed")) {
        let errors = { email: "", firstName: "", lastName: "", password: "",username:"" }
      // destructuring inside the forEach, similar to (err) => {err.properties}
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message
      })
    }
    return errors
  }

