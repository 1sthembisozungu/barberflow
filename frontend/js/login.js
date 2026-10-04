const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;


        // Temporary prototype login

        if (
            username === "admin" &&
            password === "admin"
        ) {

            window.location.href =
                "dashboard.html";

        } else {

            message.textContent =
                "Invalid username or password.";

        }

    }
);