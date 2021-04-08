import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const useForm = (callback, validate) => {
  const initialState = {
    email: "",
    password: "",
    roles: "",
  };
  const [values, setValues] = useState(initialState);
    const [message, setMessage] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const handleFormSubmit = (event) => {
    if (event) event.preventDefault();
    setValues({
      ...values,
    });
    
    axios
    .post("https://xnews-development.herokuapp.com/login", {
      email: values.email,
      password: values.password,
    })
    .then((res) => {
        setSubmitting(true);
        setErrors(validate(values));
        let token = res.data.token;
        let decode = jwt_decode(token);

        localStorage.setItem("email", decode.email);
        localStorage.setItem("roles", decode.roles);
        localStorage.setItem('id', decode.id)
        localStorage.setItem('name', decode.fullname)
        localStorage.setItem('token', token)
      })
      .catch((err) => {
        setErrors(validate(values));
        setSubmitting(false);
        err && setMessage(false);

        swal("Login Failed!", "Wrong email or password. Try Again!", "error");
      });
  };

  const handlingChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handlingChange,
    handleFormSubmit,
    history,
    values,
    errors,
    message,
  };
};

export default useForm;
