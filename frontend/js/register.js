const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");


registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const firstName =
            document.getElementById("firstName").value;

        const lastName =
            document.getElementById("lastName").value;

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            return;
        }


        // Temporary prototype behaviour

        localStorage.setItem(
            "receptionistUsername",
            username
        );


        message.textContent =
            `Account created for ${firstName} ${lastName}. You can now login.`;

    }
);