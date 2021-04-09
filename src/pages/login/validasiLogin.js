export default function validasiLogin(values, remember) {
    let errors = {};
    const validEmailRegex = RegExp(
        // eslint-disable-next-line
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );

    if (!values.email) {
        errors.email = "This field must be filled!";
    } else if (!validEmailRegex.test(values.email)) {
        errors.email = "Invalid email!";
    }

    if (!values.password) {
        errors.password = "This field must be filled!";
    }

    return errors;
}
