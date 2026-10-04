const API_BASE_URL = "/api";


// ===============================
// DASHBOARD ELEMENTS
// ===============================

const customersToday =
    document.getElementById("customersToday");

const appointmentsToday =
    document.getElementById("appointmentsToday");

const servicesCompleted =
    document.getElementById("servicesCompleted");

const revenueToday =
    document.getElementById("revenueToday");


// ===============================
// CUSTOMER ELEMENTS
// ===============================

const customerForm =
    document.getElementById("customerForm");

const customerMessage =
    document.getElementById("customerMessage");


// ===============================
// BARBER ELEMENTS
// ===============================

const barberForm =
    document.getElementById("barberForm");

const barberMessage =
    document.getElementById("barberMessage");


// ===============================
// APPOINTMENT ELEMENTS
// ===============================

const appointmentForm =
    document.getElementById("appointmentForm");

const appointmentMessage =
    document.getElementById("appointmentMessage");

const appointmentCustomer =
    document.getElementById("appointmentCustomer");

const appointmentBarber =
    document.getElementById("appointmentBarber");

const appointmentService =
    document.getElementById("appointmentService");


// ===============================
// APPOINTMENT TABLE
// ===============================

const appointmentsTable =
    document.getElementById("appointmentsTable");


// ===============================
// QUEUE
// ===============================

const queueContainer =
    document.getElementById("queueContainer");


const scheduledAppointmentsContainer =
    document.getElementById("scheduledAppointmentsContainer");


// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/dashboard`);

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                "Dashboard error:",
                data
            );

            return;
        }

        customersToday.textContent =
            data.customers_registered_today;

        appointmentsToday.textContent =
            data.appointments_today;

        servicesCompleted.textContent =
            data.services_completed_today;

        revenueToday.textContent =
            `R${Number(
                data.revenue_today
            ).toFixed(2)}`;

    } catch (error) {

        console.error(
            "Could not load dashboard:",
            error
        );

    }
}


// ===============================
// REGISTER CUSTOMER
// ===============================

customerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        customerMessage.textContent =
            "Registering customer...";


        const firstName =
            document.getElementById(
                "customerFirstName"
            ).value.trim();


        const lastName =
            document.getElementById(
                "customerLastName"
            ).value.trim();


        const phone =
            document.getElementById(
                "customerPhone"
            ).value.trim();


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/customers`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            first_name:
                                firstName,

                            last_name:
                                lastName,

                            phone:
                                phone

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                customerMessage.textContent =
                    data.error ||
                    "Failed to register customer.";

                return;
            }


            customerMessage.textContent =
                `Customer registered successfully. Customer number: ${data.customer.customer_number}`;


            customerForm.reset();


            // Refresh dashboard numbers

            loadDashboard();


            // Refresh customer dropdown

            loadCustomers();


        } catch (error) {

            console.error(error);

            customerMessage.textContent =
                "Could not connect to the server.";

        }

    }
);


// ===============================
// REGISTER BARBER
// ===============================

barberForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        barberMessage.textContent =
            "Registering barber...";


        const firstName =
            document.getElementById(
                "barberFirstName"
            ).value.trim();


        const lastName =
            document.getElementById(
                "barberLastName"
            ).value.trim();


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/barbers`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            first_name:
                                firstName,

                            last_name:
                                lastName

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                barberMessage.textContent =
                    data.error ||
                    "Failed to register barber.";

                return;
            }


            barberMessage.textContent =
                "Barber registered successfully.";


            barberForm.reset();


            // Refresh barber dropdown

            loadBarbers();


        } catch (error) {

            console.error(error);

            barberMessage.textContent =
                "Could not connect to the server.";

        }

    }
);


// ===============================
// LOAD CUSTOMERS
// ===============================

async function loadCustomers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/customers`
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Customers error:",
                data
            );

            return;
        }


        appointmentCustomer.innerHTML =
            `<option value="">
                Select Customer
            </option>`;


        data.customers.forEach(
            customer => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    customer.id;


                option.textContent =
                    `${customer.first_name} ${customer.last_name} - ${customer.customer_number}`;


                appointmentCustomer.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Could not load customers:",
            error
        );

    }
}


// ===============================
// LOAD BARBERS
// ===============================

async function loadBarbers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/barbers`
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Barbers error:",
                data
            );

            return;
        }


        appointmentBarber.innerHTML =
            `<option value="">
                Select Barber
            </option>`;


        data.barbers.forEach(
            barber => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    barber.id;


                option.textContent =
                    `${barber.first_name} ${barber.last_name}`;


                appointmentBarber.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Could not load barbers:",
            error
        );

    }
}


// ===============================
// LOAD SERVICES
// ===============================

async function loadServices() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/services`
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Services error:",
                data
            );

            return;
        }


        appointmentService.innerHTML =
            `<option value="">
                Select Service
            </option>`;


        data.services.forEach(
            service => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    service.id;


                option.textContent =
                    `${service.name} - R${Number(
                        service.price
                    ).toFixed(2)}`;


                appointmentService.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Could not load services:",
            error
        );

    }
}


// ===============================
// BOOK APPOINTMENT
// ===============================

appointmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        appointmentMessage.textContent =
            "Booking appointment...";


        const customerId =
            appointmentCustomer.value;


        const barberId =
            appointmentBarber.value;


        const serviceId =
            appointmentService.value;


        const date =
            document.getElementById(
                "appointmentDate"
            ).value;


        const time =
            document.getElementById(
                "appointmentTime"
            ).value;


        if (!customerId) {

            appointmentMessage.textContent =
                "Please select a customer.";

            return;
        }


        if (!serviceId) {

            appointmentMessage.textContent =
                "Please select a service.";

            return;
        }


        if (!date || !time) {

            appointmentMessage.textContent =
                "Please select date and time.";

            return;
        }


        // Convert date + time into the
        // format expected by Flask

        const scheduledAt =
            `${date}T${time}`;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/appointments`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            customer_id:
                                Number(
                                    customerId
                                ),

                            barber_id:
                                barberId
                                    ? Number(
                                        barberId
                                    )
                                    : null,

                            service_id:
                                Number(
                                    serviceId
                                ),

                            scheduled_at:
                                scheduledAt

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                appointmentMessage.textContent =
                    data.error ||
                    "Failed to book appointment.";

                return;
            }


            appointmentMessage.textContent =
                "Appointment booked successfully.";


            appointmentForm.reset();


            // Refresh everything

            loadDashboard();

            loadAppointments();

            loadQueue();


        } catch (error) {

            console.error(error);

            appointmentMessage.textContent =
                "Could not connect to the server.";

        }

    }
);


// ===============================
// LOAD APPOINTMENTS
// ===============================

async function loadAppointments() {
    try {
        const response =
            await fetch(`${API_BASE_URL}/appointments`);

        const data = await response.json();

        if (!response.ok) {
            console.error("Appointments error:", data);
            return;
        }

        appointmentsTable.innerHTML = "";

        // Only show completed appointments
        const completedAppointments =
            data.appointments.filter(
                appointment =>
                    appointment.status === "completed"
            );

        if (completedAppointments.length === 0) {
            appointmentsTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No completed services today.
                    </td>
                </tr>
            `;
            return;
        }

        completedAppointments.forEach(appointment => {

            const row = document.createElement("tr");

            const customer =
                appointment.customer;

            const customerName =
                `${customer.first_name} ${customer.last_name}`;

            const barber =
                appointment.barber
                    ? `${appointment.barber.first_name} ${appointment.barber.last_name}`
                    : "Not assigned";

            const service =
                appointment.service
                    ? appointment.service.name
                    : "Unknown";

            const time =
                appointment.scheduled_at
                    ? new Date(
                        appointment.scheduled_at
                    ).toLocaleString()
                    : "Not scheduled";

            row.innerHTML = `
                <td>${customerName}</td>

                <td>
                    ${customer.customer_number}
                </td>

                <td>
                    ${service}
                </td>

                <td>
                    ${barber}
                </td>

                <td>
                    ${time}
                </td>

                <td>
                    ${appointment.status}
                </td>
            `;

            appointmentsTable.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Could not load appointments:",
            error
        );
    }
}

// ===============================
// LOAD SCHEDULED APPOINTMENTS
// ===============================

async function loadScheduledAppointments() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/appointments`);

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Scheduled appointments error:",
                data
            );

            return;
        }

        scheduledAppointmentsContainer.innerHTML = "";

        const scheduledAppointments =
            data.appointments.filter(
                appointment =>
                    appointment.status === "scheduled"
            );

        if (scheduledAppointments.length === 0) {

            scheduledAppointmentsContainer.innerHTML =
                "<p>No scheduled appointments.</p>";

            return;
        }

        scheduledAppointments.forEach(appointment => {

            const appointmentCard =
                document.createElement("div");

            const customer =
                appointment.customer;

            const customerName =
                `${customer.first_name} ${customer.last_name}`;

            const barber =
                appointment.barber
                    ? `${appointment.barber.first_name} ${appointment.barber.last_name}`
                    : "Not assigned";

            const scheduledTime =
                appointment.scheduled_at
                    ? new Date(
                        appointment.scheduled_at
                    ).toLocaleString()
                    : "Not scheduled";

            appointmentCard.innerHTML = `

                <div class="scheduled-card">

                    <div class="scheduled-info">

                        <h3>
                            ${customerName}
                        </h3>

                        <p>
                            Customer Number:
                            ${customer.customer_number}
                        </p>

                        <p>
                            Service:
                            ${appointment.service.name}
                        </p>

                        <p>
                            Barber:
                            ${barber}
                        </p>

                        <p>
                            Appointment:
                            ${scheduledTime}
                        </p>

                    </div>

                    <div class="scheduled-action">

                        <button
                            onclick="checkInAppointment(${appointment.id})">
                            Check In
                        </button>

                    </div>

                </div>

            `;

            scheduledAppointmentsContainer.appendChild(
                appointmentCard
            );

        });

    } catch (error) {

        console.error(
            "Could not load scheduled appointments:",
            error
        );

        scheduledAppointmentsContainer.innerHTML =
            "<p>Could not load scheduled appointments.</p>";
    }
}

// ===============================
// LOAD QUEUE
// ===============================

async function loadQueue() {
    try {
        const response =
            await fetch(`${API_BASE_URL}/appointments/queue`);

        const data = await response.json();

        if (!response.ok) {
            console.error("Queue error:", data);
            return;
        }

        queueContainer.innerHTML = "";

        if (!data.queue || data.queue.length === 0) {
            queueContainer.innerHTML =
                "<p>No customers currently in the queue.</p>";
            return;
        }

        data.queue.forEach((appointment, index) => {

            const queueItem = document.createElement("div");

            let actionButton = "";

            if (appointment.status === "checked_in") {

                actionButton = `
                    <button
                        onclick="startAppointment(${appointment.appointment_id})">
                        Start Service
                    </button>
                `;

            } else if (appointment.status === "in_progress") {

                actionButton = `
                    <button
                        onclick="completeAppointment(${appointment.appointment_id})">
                        Complete Service
                    </button>
                `;
            }

            const status =
                appointment.status === "checked_in"
                    ? "WAITING"
                    : "IN SERVICE";

            queueItem.innerHTML = `
                <div class="queue-card">

                    <div class="queue-position">
                        #${index + 1}
                    </div>

                    <div class="queue-info">

                        <h3>
                            ${appointment.customer.first_name}
                            ${appointment.customer.last_name}
                        </h3>

                        <p>
                            Customer Number:
                            ${appointment.customer.customer_number}
                        </p>

                        <p>
                            Service:
                            ${appointment.service}
                        </p>

                        <p>
                            Barber:
                            ${appointment.barber || "Not assigned"}
                        </p>

                    </div>

                    <div class="queue-status">
                        <span>${status}</span>
                    </div>

                    <div class="queue-action">
                        ${actionButton}
                    </div>

                </div>
            `;

            queueContainer.appendChild(queueItem);
        });

    } catch (error) {

        console.error(
            "Could not load queue:",
            error
        );

        queueContainer.innerHTML =
            "<p>Could not load the queue.</p>";
    }
}


// ===============================
// REFRESH BUTTONS
// ===============================

document
    .getElementById(
        "refreshAppointments"
    )
    .addEventListener(
        "click",
        loadAppointments
    );


document
    .getElementById(
        "refreshQueue"
    )
    .addEventListener(
        "click",
        loadQueue
    );


document
    .getElementById("refreshScheduledAppointments")
    .addEventListener(
        "click",
        loadScheduledAppointments
    );


// ===============================
// QUICK ACTION BUTTONS
// ===============================

document
    .getElementById(
        "showCustomerForm"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "customers"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById(
        "showBarberForm"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "barbers"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById(
        "showAppointmentForm"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "bookAppointment"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


// ===============================
// LOGOUT
// ===============================

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "login.html";

        }
    );


async function checkInAppointment(appointmentId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/check-in`,
                {
                    method: "PATCH"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not check in customer."
            );

            return;
        }


        alert(
            "Customer checked in successfully."
        );


        loadAppointments();

        loadQueue();

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }
}

async function startAppointment(appointmentId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/start`,
                {
                    method: "PATCH"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not start service."
            );

            return;
        }


        alert(
            "Service started."
        );


        loadAppointments();

        loadQueue();

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }
}

async function completeAppointment(appointmentId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/complete`,
                {
                    method: "PATCH"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not complete service."
            );

            return;
        }


        alert(
            "Service completed successfully."
        );


        loadAppointments();

        loadQueue();

        loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }
}


// ===============================
// INITIAL LOAD
// ===============================

loadDashboard();

loadCustomers();

loadBarbers();

loadServices();

loadAppointments();

loadQueue();

loadScheduledAppointments();